exports.up = function(knex, Promise) {
  return knex.schema.createTable('chapters', function(table) {
    table.increments();
    table.integer('number').unique().notNullable();
    table.string('name').unique().notNullable();
    table.string('content').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('chapters');
};
