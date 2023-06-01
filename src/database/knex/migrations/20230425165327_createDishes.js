exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id").primary();
    table.text("name");
    table.text("description");
    table.text("price");
    table.text("image").nullable();
    
    table.integer("user_id").references("id").inTable("users");
    table.integer("category_id").references("id").inTable("categories");
    
   
});
  
exports.down = knex => knex.schema.dropTable("dishes");


