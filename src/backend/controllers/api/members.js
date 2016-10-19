'use strict'

const _                           = require('lodash'),
      Promise                     = require('bluebird'),
      Checkit                     = require('checkit'),
      {Parameters}                = require('strong-params'),
      {database, log}             = require('../../constants'),
      {models, bookshelf}         = database,
      {csvMultipartStreamReader}  = require('../../helpers/express'),
      {Member}                    = models

/* eslint-disable one-var */
module.exports = {

  // Required by pipe-test-drive
  importMembers (req, res) {
    const reader = csvMultipartStreamReader(req, 'file'),
          problemous = []
    let processing = 0,
        ending = false,
        batch = []

    const sendResult = function () {
      res.status(200)
      if (!_.isEmpty(problemous)) {
        res.send({
          problemousRecords: problemous
        })
      }
    }

    // Perform the operation in a transaction
    return bookshelf.transaction(function (t) {
      return Promise(function (resolve, reject) {
        const maybeEnd = function () {
          if (!processing && ending) {
            resolve()
          }
        }
        const saveBatch = function () {
          processing++
          // Perform operation totally asynchronously
          Promise.filter(batch, function (record) {
            // Validate all records to safe-guard the operation
            // so it wouldn't fail in DB
            return Member.prototype.validateSave.call({attributes: record})
            // Return `true` if all OK
            .then(() => true)
            // Otherwise memorize the problemous record
            // and filter it
            .catch(Checkit.Error, function () {
              problemous.push(record)
              return false
            })
          // Perform saving of the batch
          }).then(function (validRecords) {
            // Raw insertion
            return bookshelf.knex(Member.prototype.tableName).insert(validRecords)
            // If still something goes wrong memorize them
            .catch(function (err) {
              log.error(err, err)
              problemous.push.apply(problemous, validRecords)
            })
          }).finally(function () {
            processing--
            maybeEnd()
          })

          // `Promise.filter`already has `batch` reference.
          // We can clear the batch.
          batch = []
        }
        const readCSVLine = function (record) {
          // Destruct array of CSV values
          const [, name, age, address, team] = record
          // Push a member object to batch
          batch.push({name, age, address, team})

          if (batch.length === 100) {
            saveBatch()
          }
        }

        reader.on('readable', function () {
          let record
          while ((record = reader.read())) {
            readCSVLine(record)
          }
        })
        // Pass error to Promise reject
        reader.on('error', reject)
        reader.on('finish', function () {
          ending = true
          maybeEnd()
        })
      })
    }).then(sendResult)
  },

  // Required by pipe-test-drive
  getMembers (req, res) {
    return Member.fetchAll()
    .then(function (members) {
      res.send(members.toJSON())
    })
  },

  // Additional CRUD actions
  addMember (req, res) {
    return new Member(memberParams(req)).save()
    .then(function (member) {
      res.send(member.toJSON())
    })
  },

  getMember (req, res) {
    return Member.findById(req.params.id)
    .then(function (member) {
      res.send(member.toJSON())
    })
    .catch(Member.NotFoundError, function (err) {
      log.error(err, err)
      res.send(404)
    })
  },

  updateMember (req, res) {
    return Member.findById(req.params.id)
    .then(function (member) {
      return member.save(memberParams(req))
    })
    .then(function (member) {
      req.send(member.toJSON())
    })
    .catch(Member.NotFoundError, function (err) {
      log.error(err, err)
      res.send(404)
    })
  },

  deleteMember (req, res) {
    return Member.destroy({id: req.params.id})
    .then(function (member) {
      req.send(204)
    })
    .catch(Member.NotFoundError, function (err) {
      log.error(err, err)
      res.send(404)
    })
  },

  memberParams

}

function memberParams (req) {
  return Parameters(req.params).permit('name', 'age', 'address', 'team').value()
}
