(global.should = require('should').noConflict()).extend()
const sinon = global.sinon = require('sinon')
// Standard `sinon.test` has issues with promise sandboxing
// https://github.com/sinonjs/sinon/issues/1119
sinon.test = require('sinon-test').configureTest(sinon)
// Easen spy/stub assert
require('should-sinon')
