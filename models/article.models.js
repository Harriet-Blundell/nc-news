const connection = require("../db/connection.js");

function fetchArticleId(article_id) {
  return connection("articles")
    .where("articles.article_id", article_id)
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(articleId => {
      if (articleId.length === 0) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }
      return articleId[0];
    });
}

function updateArticleVote(body, article_id) {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", body.inc_votes || 0)
    .returning("*")
    .then(updateVote => {
      if (updateVote.length === 0) {
        return Promise.reject({ msg: "ID not found", status: 404 });
      }
      return updateVote[0];
    });
}

function createArticleComment(article_id, newComment) {
  return connection
    .insert({
      author: newComment.username,
      article_id: article_id,
      body: newComment.body
    })
    .into("comments")
    .returning("*")
    .then(createdComment => {
      return createdComment[0];
    });
}

function fetchCommentsById(sort_by, order, article_id) {
  return connection
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then(commentOrdered => {
      if (commentOrdered.length === 0 && article_id !== undefined) {
        return checkIfExists(article_id, "article_id", "articles").then(
          articleIdComment => {
            if (articleIdComment === true) {
              return [];
            } else {
              return Promise.reject({ msg: "ID not found", status: 404 });
            }
          }
        );
      }

      return commentOrdered;
    });
}

function fetchArticles(sort_by, order, topic, author) {
  return connection("articles")
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .orderBy(sort_by || "created_at", order || "desc")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(queries => {
      if (topic) {
        queries.where("articles.topic", "=", topic);
      } else if (author) {
        queries.where("articles.author", "=", author);
      }
    })
    .then(result => {
      if (result.length === 0 && author !== undefined) {
        return checkIfExists(author, "username", "users").then(authorResult => {
          if (authorResult === true) {
            return result;
          } else {
            return Promise.reject({ msg: "User not found", status: 404 });
          }
        });
      } else if (result.length === 0 && topic !== undefined) {
        return checkIfExists(topic, "slug", "topics").then(topicResult => {
          if (topicResult === true) {
            return result;
          } else {
            return Promise.reject({ msg: "Topic not found", status: 404 });
          }
        });
      } else {
        return result;
      }
    });
}

// const checkIfAuthorExists = checkIfExists(author, "username", "users");

// const checkIfTopicExists = checkIfExists(topic, "slug", "topics");

// return Promise.all([result, checkIfAuthorExists, checkIfTopicExists]);

function checkIfExists(value, column, table) {
  return connection
    .select("*")
    .from(table)
    .where(column, "=", value)
    .then(checkResult => {
      if (checkResult.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
}

function removeArticleById(article_id) {
  return connection("articles")
    .where("article_id", "=", article_id)
    .del()
    .then(removeArticle => {
      if (removeArticle <= 0) {
        return Promise.reject({ msg: "Article ID Not Found", status: 404 });
      }
    });
}

function createAnArticle(article) {
  const { author, title, topic, body } = article;

  return connection("articles")
    .insert({
      author: author,
      title: title,
      topic: topic,
      body: body
    })
    .returning("*")
    .then(newArticle => {
      return newArticle;
    });
}

module.exports = {
  fetchArticleId,
  updateArticleVote,
  createArticleComment,
  fetchCommentsById,
  fetchArticles,
  checkIfExists,
  removeArticleById,
  createAnArticle
};
