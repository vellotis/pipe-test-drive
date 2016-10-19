const express             = require('express'),
      router              = express.Router(),
      {handleSafely}      = require('../../helpers/express'),
      membersController   = require('../controllers/members')

router.get('/', function (req, res) {
  handleSafely(membersController.getDatabaseConfig)(req, res)
})

router.post('/', function (req, res) {
  handleSafely(membersController.configureDatabase)(req, res)
})

router.get('/:id', function (req, res) {
  handleSafely(membersController.getDatabaseConfig)(req, res)
})

router.put('/:id', function (req, res) {
  handleSafely(membersController.getDatabaseConfig)(req, res)
})

router.delete('/:id', function (req, res) {
  handleSafely(membersController.getDatabaseConfig)(req, res)
})

module.exports = router
