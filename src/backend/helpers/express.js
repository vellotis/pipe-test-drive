const Checkit     = require('checkit'),
      Promise     = require('bluebird'),
      formidable  = require('formidable'),
      Parser      = require('csv-parse'),
      {log}       = require('../constants')

function handleSafely (handle) {
  return function (req, res) {
    return Promise.try(function () {
      return handle(req, res)
    })
    .catch(Checkit.Error, function (err) {
      log.error(err, err)
      res.status(400).send({error: 'A required parameter was not specified for this request.'})
    })
    .catch(function (err) {
      log.error(err, err)
      res.status(500).send({error: 'The server encountered an internal error. Please retry the request.'})
    })
  }
}

function csvMultipartStreamReader (req, fieldName) {
  const form = new formidable.IncomingForm(),
        parser = Parser()

  form.onPart = function (part) {
    if (!part.filename || !fieldName || part.name !== fieldName) {
      form.handlePart(part)
    }

    form._flushing++

    part.on('data', function (buffer) {
      // Nothing to process
      if (buffer.length === 0) {
        return
      }

      // Process CSV part
      form.pause()
      parser.write(buffer, function () {
        form.resume()
      })
    })

    part.on('end', function () {
      parser.end(function () {
        form._flushing--
        form._maybeEnd()
      })
    })
  }

  form.parse(req)

  return parser
}

module.exports = {
  handleSafely, csvMultipartStreamReader
}
