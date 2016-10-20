/* global describe, it, before, after, sinon */
/* eslint-disable space-in-parens */
const Promise     = require('bluebird'),
      portfinder  = require('portfinder'),
      restify     = require('restify-clients'),
      controller  = require('../../../../../src/backend/controllers/api/members'),
      server      = require('../../../../../src/backend')
let client

describe('Routes API Members', function () {
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

  it('should invoke Members controller `importMembers` action', sinon.test(function () {
    // Prepare
    this.stub(controller, 'importMembers', (req, res) => res.send(200))

    // Test
    return client.get('/api/config')

    // Verify
    .then(function () {
      ( controller.importMembers ).should.be.calledOnce()
    })
  }))

  it('should invoke Members controller `getMembers` action', sinon.test(function () {
    // Prepare
    this.stub(controller, 'getMembers', (req, res) => res.send(200))

    // Test
    return client.put('/api/config')

    // Verify
    .then(function () {
      ( controller.getMembers ).should.be.calledOnce()
    })
  }))
})
