/* global describe, it, should */
const controller = require('../../../../../src/backend/controllers/api/members')

/* eslint-disable one-var, space-in-parens, key-spacing */
describe('Members controller', function () {
  describe('memberParams method', function () {
    it('should whitelist correctly', function () {
      // Prepare
      const req = {
        params: {
          name:       'Random Name',
          age:        62,
          address:    '234 William Street',
          team:       'BLUE',
          otherAge:   26,
          otherName:  'Name Random'
        }
      }

      // Test
      const result = controller.memberParams(req)

      // Verify
      should( result ).have.keys( 'name', 'age', 'address', 'team' )
    })
  })
})
