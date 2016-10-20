'use strict'

const _             = require('lodash'),
      Promise       = require('bluebird'),
      {Parameters}  = require('strong-params'),
      jsonfile      = Promise.promisifyAll(require('jsonfile')),
      defaultConfig = require('../../../../config/default.json'),
      {log}         = require('../../constants'),
      initKnex      = require('../../initializers/database'), /*
      Knex          = require('knex') */
      possibleEnvs  = ['development', 'test', 'production']

/* eslint-disable one-var */
module.exports = {

  configureDatabase (req, res) {
    const params  = dbParams(req)

    const saveEnvConfigs = function () {
      return Promise.map(possibleEnvs, function (env) {
        const connectionConfig = params[env]
        if (connectionConfig) {
          // Perform similar operation that 'config' package does
          const config = _.defaultsDeep({}, {dbConfig: connectionConfig}, defaultConfig)

          // Write computed config to file
          return jsonfile.writeFileAsync(`../../../../${ env }.json`, config)
          .then(function () {
            // Try to test connection (and use it if all ok)
            return initKnex(config.dbConfig, env)
            .then(() => true)
            .catch((err) => {
              log.error(err, err)
              return false
            })
          })
        }
      })
    }
    const sendResponse = function (dev, test, prod) {
      res.status(200).send({
        /* eslint-disable key-spacing */
        development:  dev,
        test:         test,
        prod:         prod
        /* eslint-enable key-spacing */
      })
    }

    // Process
    return Promise.resolve()
    .then(saveEnvConfigs)
    .spread(sendResponse)
  },

  getDatabaseConfig (req, res) {
    const fetchEnvConfigs = function () {
      return Promise.map(possibleEnvs, function (env) {
        jsonfile.readFileAsync()
        .then((config) => config.dbConfig)
        .then((dbConfig) => {
          return initKnex(dbConfig, env)
          .then(function () {
            return [dbConfig, true]
          })
        })
        .catch((err) => {
          log.error(err, err)
          return [{}, true]
        })
      })
    }
    const sendResponse = function (
      [devConf, devStatus],
      [testConf, testStatus],
      [prodConf, prodStatus]
    ) {
      res.status(200).send({
        /* eslint-disable key-spacing */
        development: {
          config: devConf,
          status: devStatus
        },
        test: {
          config: testConf,
          status: testStatus
        },
        prod: {
          config: prodConf,
          status: prodStatus
        },
        current: process.env.NODE_ENV
        /* eslint-enable key-spacing */
      })
    }

    // Process
    return Promise.resolve()
    .then(fetchEnvConfigs)
    .spread(sendResponse)
  },

  dbParams

}

function dbParams (req) {
  return Parameters(req.params).permit(
    /* eslint-disable key-spacing */
    { 'development': ['host', 'user', 'password', 'database'] },
    { 'test':        ['host', 'user', 'password', 'database'] },
    { 'production':  ['host', 'user', 'password', 'database'] }
    /* eslint-enable key-spacing */
  ).value()
}
