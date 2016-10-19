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
const models = Object.assign({},
  require('../models/member')
)

function initKnex (dbConfig) {
  const trytoDestroyKnexIfPresent = function () {
    return knex && knex.destroy()
  }
  const initKnex = function () {
    module.exports.knex = knex = require('knex')(dbConfig)
  }
  const checkConnection = function () {
    return testConnection(knex)
  }
  const assignKnexToBookshelf = function () {
    bookshelf.knex = knex
  }

  return Promise.resolve()
  .then(trytoDestroyKnexIfPresent)
  .then(initKnex)
  .then(checkConnection)
  .then(assignKnexToBookshelf)
}

module.exports = {
  knex, bookshelf, models, initKnex
}
