exports.testConnection = function (knex) {
  return knex.raw('select 1+1 as result')
}
