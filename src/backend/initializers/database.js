'use strict'

const Promise           = require('bluebird'),
      config            = require('config'),
      Knex              = require('knex'),
      {testConnection}  = require('../helpers/database')
let knex                = Knex(config.dbConfig)
/* eslint-disable one-var */
const bookshelf         = require('bookshelf')(knex)

// Load plugins
bookshelf.plugin('registry')

// Load models
const models = {}

module.exports = {
  knex, bookshelf, models, initKnex
}

Object.assign({},
  require('../models/member')
)

function initKnex (dbConfig, env) {
  const trytoDestroyKnexIfPresent = function () {
    return knex && knex.destroy()
  }
  const initKnex = function () {
    return Knex(dbConfig)
  }
  const verifyConnection = function (_knex) {
    return testConnection(_knex)
    .catch(function (err) {
      // Dispose connection if any
      return _knex.destroy()
      // And pass the exception
      .thenThrow(err)
    })
  }
  const assignKnexToBookshelf = function (_knex) {
    // Start using it only if we are handling currently active environment
    if (env === process.env.NODE_ENV) {
      return trytoDestroyKnexIfPresent()
      .then(function () {
        // Assign new connection
        module.exports.knex = bookshelf.knex = knex = _knex
      })
    } else {
      // We do not need this connection. Close it.
      return _knex.destroy()
    }
  }

  // Process
  return Promise.resolve()
  .then(initKnex)
  .tap(verifyConnection)
  .then(assignKnexToBookshelf)
}
