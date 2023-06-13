exports.up = knex => knex.schema.createTable("orderItems", table => {
    table.increments("id").primary();

    table.integer("dishes_id").references("id").inTable("dishes").onDelete("CASCADE")
    table.integer("orders_id").references("id").inTable("orders").onDelete("CASCADE")
    
    table.text("title");
    table.integer("quantity");
    
    table.timestamp("created_at").default(knex.fn.now());    
});
  
exports.down = knex => knex.schema.dropTable("orderItems");
