exports.up = knex => knex.schema.createTable("categories", table => {
    table.increments("id").primary();
    table.text("category");
});
  
exports.down = knex => knex.schema.dropTable("categories");
