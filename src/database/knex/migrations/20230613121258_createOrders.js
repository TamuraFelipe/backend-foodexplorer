exports.up = knex => knex.schema.createTable("orders", table => {
    table.increments("id").primary();

    table.integer("user_id").references("id").inTable("users")
    
    table.text("status");
    table.text("total");
    table.text("paymentMethod");

    table.timestamp("created_at").default(knex.fn.now());    
});
  
exports.down = knex => knex.schema.dropTable("orders");