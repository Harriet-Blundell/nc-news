exports.up = function(knex) {
  return knex.schema.createTable("comment", commentTable => {
    commentTable.increments("comment_id").primary();
    commentTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentTable.integer("article_id").references("articles.articles_id");
    commentTable.integer("votes").defaultTo(0);
    commentTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentTable.text("body").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comment");
};