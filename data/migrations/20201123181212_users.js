exports.up = function (knex) {
  return knex.schema

    .createTable("roles", (r) => {
      r.increments("role_id");
      r.string("rolename", 64).notNullable().unique();
    })
    .createTable("users", (users) => {
      users.increments("user_id");
      users.string("username", 255).notNullable().unique();
      users.string("password", 255).notNullable();
      users
        .integer("role_id")
        .notNullable()
        .unsigned()
        .references("role_id")
        .inTable("roles")
        .onUpdate("RESTRICT")
        .onDelete("RESTRICT");
    })
    .createTable("riddles", (riddles) => {
      riddles.string("id").unique().notNullable();
      riddles.string("bilmece").notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("riddles")
    .dropTableIfExists("users")
    .dropTableIfExists("roles");
};
