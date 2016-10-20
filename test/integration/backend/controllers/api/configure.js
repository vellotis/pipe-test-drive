/* global describe, it, beforeAll, afterAll, sinon */
const controller      = require('../../../../../src/backend/controllers/api/configure'),
      {handleSafely}  = require('../../../../../src/backend/helpers/express'),
      {database}      = require('../../../../../src/backend/constants'),
      jsonfile        = require('jsonfile')

/* eslint-disable one-var, space-in-parens, key-spacing */
describe('Configure controller', function () {
  let sb
  beforeAll('Setup Sinon Sandbox', function () {
    sb = sinon.sandbox.create()
  })
  afterAll('Tear donw Sinon Sandbox', function () {
    sb.restore()
    sb = null
  })

  describe('configureDatabase action', function () {
    it('should whitelist correctly', function () {
      // Prepare
      const req = {
        body: {
          development: {
            host:       'dev-random.host.ad',
            user:       'dev-random-user-name',
            password:   'dev-random-password',
            database:   'dev-random-database'
          },
          test: {
            host:       'test-random.host.ad',
            user:       'test-random-user-name',
            password:   'test-random-password',
            database:   'test-random-database'
          },
          production: {
            host:       'prod-random.host.ad',
            user:       'prod-random-user-name',
            password:   'prod-random-password',
            database:   'prod-random-database'
          }
        }
      }
      sb.stub(jsonfile, 'writeFileAsync', () => Promise.resolve())
      sb.stub(database, 'initKnex', () => Promise.resolve())
      const reqSend = sb.stub(),
            reqStatus = sb.stub()
      const res = sb.stub(function () {
        return {
          send: reqSend,
          status: reqStatus
        }
      })

      // Test
      return handleSafely(controller.configureDatabase)(req, res)

      // Verify
      .then(function () {
        ( jsonfile.writeFileAsync ).should.have.callCount( 3 );
        ( jsonfile.writeFileAsync ).should.be.calledWith( sinon.match.string, req.body.development ).calledOnce();
        ( jsonfile.writeFileAsync ).should.be.calledWith( sinon.match.string, req.body.test ).calledOnce();
        ( jsonfile.writeFileAsync ).should.be.calledWith( sinon.match.string, req.body.production ).calledOnce();
        ( jsonfile.initKnex ).should.have.callCount( 3 );
        ( jsonfile.initKnex ).should.be.calledWith( sinon.match.string, req.body.development ).calledOnce();
        ( jsonfile.initKnex ).should.be.calledWith( sinon.match.string, req.body.test ).calledOnce();
        ( jsonfile.initKnex ).should.be.calledWith( sinon.match.string, req.body.production ).calledOnce()
      })
    })
  })
})
