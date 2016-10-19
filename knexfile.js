const config = require('config')

// We are holding configuration in `config` folder.
// But knex migration requires `knexfile.js`.
module.exports = {
  [process.env.NODE_ENV]: Object.assign({},
    config.get('dbConfig'), {
      migrations: {
        tableName: 'knex_migrations'
      }
    }
  )
}

/* -- Example result --
  {
    development: {
      "client": "mysql2",
      "connection": {
        "host": "--HOST--",
        "user": "--USERNAME--",
        "password": "--PASSWORD--",
        "database": "--DATABASE--",
        "charset": "utf8",
        "timezone": "UTC",
        "decimalNumbers": true
      }
      migrations: {
        tableName: 'knex_migrations'
      }
    }
  }
*/
