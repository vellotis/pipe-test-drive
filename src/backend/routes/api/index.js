const express = require('express'),
      router = express.Router()

router.use('/config', require('./configure'))
router.use('/members', require('./members'))

module.exports = router
