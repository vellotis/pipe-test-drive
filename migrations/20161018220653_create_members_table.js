module.exports = {
  up (knex, Promise) {
    return knex.schema.createTableIfNotExists('members', (t) => {
      t.specificType('id', 'int not null auto_increment primary key')

      t.string('name').notNullable()
      t.integer('age').notNullable()
      t.string('address').notNullable()
      t.string('team').notNullable()

      // Add timestamps fields
      t.timestamps()
      t.dateTime('deleted_at')

      // Add indexes to make searching faster
      t.index(['deleted_at', 'name', 'address', 'team'], 'idx_users__deleted_at__name__address')
      t.index(['deleted_at', 'address', 'team'], 'idx_users__deleted_at__address__team')
      t.index(['deleted_at', 'team', 'name'], 'idx_users__deleted_at__team__name')
    })
  },

  down (knex, Promise) {
    return knex.schema.dropTableIfExists('members')
  }
}
