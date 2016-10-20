/* global describe, it, before, after, sinon */
/* eslint-disable space-in-parens */
const Promise     = require('bluebird'),
      portfinder  = require('portfinder'),
      restify     = require('restify-clients'),
      controller  = require('../../../../../src/backend/controllers/api/configure'),
      server      = require('../../../../../src/backend')
let client

describe('Routes API Configure', function () {
  before('Create JSON REST client and server', function () {
    return Promise.promisify(portfinder.getPort)()
    .then(function (port) {
      client = restify.createJSONClient({
        url: `http://localhost:${ port }`
      })
      Promise.promisifyAll(client)
      return Promise.promisify(server.listen, server)(port)
    })
  })

  after('Close server and JSON REST client', function () {
    client.close()
    return Promise.promisify(server.close, server)()
  })

  it('should invoke Configure controller `getDatabaseConfig` action', sinon.test(function () {
    // Prepare
    this.stub(controller, 'getDatabaseConfig', (req, res) => res.send(200))

    // Test
    return client.get('/api/config')

    // Verify
    .then(function () {
      ( controller.getDatabaseConfig ).should.be.calledOnce()
    })
  }))

  it('should invoke Configure controller `configureDatabase` action', sinon.test(function () {
    // Prepare
    this.stub(controller, 'configureDatabase', (req, res) => res.send(200))

    // Test
    return client.put('/api/config')

    // Verify
    .then(function () {
      ( controller.configureDatabase ).should.be.calledOnce()
    })
  }))
})
