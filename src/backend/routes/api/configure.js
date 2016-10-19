const express             = require('express'),
      router              = express.Router(),
      {handleSafely}      = require('../../helpers/express'),
      configureController = require('../controllers/configure')

router.get('/', function (req, res) {
  handleSafely(configureController.getDatabaseConfig)(req, res)
})

router.post('/', function (req, res) {
  handleSafely(configureController.configureDatabase)(req, res)
})

module.exports = router
