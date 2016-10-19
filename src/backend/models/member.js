const {bookshelf} = require('../initializers/database'),
      checkit = require('checkit')

class Member extends bookshelf.Model {
  static assignProperties () {
    /* eslint-disable no-multi-spaces */
    this.prototype.tableName      = 'members'
    this.prototype.hasTimestamps  = true
    /* eslint-enable no-multi-spaces */
  }

  initialize () {
    // Call super. Plugins may have attavhed
    // required procedures
    super.initialize(...arguments)

    this.on('saving', this.validateSave)
  }

  validateSave (model, attrs, opts) {
    return checkit({
      /* eslint-disable no-multi-spaces, standard/array-bracket-even-spacing */
      id:         ['integer'            ],
      name:       ['string',  'required'],
      age:        ['integer', 'required'],
      address:    ['string',  'required'],
      team:       ['string',  'required'],
      created_at: ['date',    'required'],
      updated_at: ['date',    'required'],
      deleted_at: ['date'               ]
      /* eslint-enable no-multi-spaces, standard/array-bracket-even-spacing */
    }).run(this.attributes)
  }
}
Member.assignProperties()

exports.Member = bookshelf.model('Member', Member)
