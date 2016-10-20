const express = require('express'),
      bodyParser = require('body-parser'),
      app = express()

// Middleware
app.use(bodyParser.json())

// Routes
app.use('/', require('./routes'))

module.exports = app
