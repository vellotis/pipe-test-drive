/* global describe, it, should */
const controller = require('../../../../../src/backend/controllers/api/configure')

/* eslint-disable one-var, space-in-parens */
describe('Configure controller', function () {
  describe('dbParams method', function () {
    it('should whitelist correctly', function () {
      // Prepare
      const req = {
        params: {
          development: {
            host:       'random.host.ad',
            user:       'random-user-name',
            password:   'random-password',
            database:   'random-database',
            otherField: 'random-value',
            otherHost:  'other-random-value'
          },
          test: {
            host:       'random.host.ad',
            user:       'random-user-name',
            password:   'random-password',
            database:   'random-database',
            otherField: 'random-value',
            otherHost:  'other-random-value'
          },
          production: {
            host:       'random.host.ad',
            user:       'random-user-name',
            password:   'random-password',
            database:   'random-database',
            otherField: 'random-value',
            otherHost:  'other-random-value'
          }
        }
      }

      // Test
      const result = controller.dbParams(req)

      // Verify
      should( result.development ).have.keys( 'host', 'user', 'password', 'database' )
      should( result.test ).have.keys( 'host', 'user', 'password', 'database' )
      should( result.production ).have.keys( 'host', 'user', 'password', 'database' )
    })
  })
})
