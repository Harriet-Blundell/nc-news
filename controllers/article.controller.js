const {
  fetchArticleId,
  updateArticleVote,
  createArticleComment,
  fetchCommentsById,
  fetchArticles,
  removeArticleById,
  createAnArticle
} = require("../models/article.models");

function getArticleId(req, res, next) {
  const { article_id } = req.params;

  fetchArticleId(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
}

function patchArticleVote(req, res, next) {
  const { article_id } = req.params;

  updateArticleVote(req.body, article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
}

function postArticleComment(req, res, next) {
  createArticleComment(req.params.article_id, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
}

function getCommentsById(req, res, next) {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;

  fetchCommentsById(sort_by, order, article_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      next(err);
    });
}

function getArticles(req, res, next) {
  const { sort_by, order, topic, author } = req.query;

  fetchArticles(sort_by, order, topic, author)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
}

function deleteArticleById(req, res, next) {
  const { article_id } = req.params;

  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
}

function postArticle(req, res, next) {
  createAnArticle(req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
}

module.exports = {
  getArticleId,
  patchArticleVote,
  postArticleComment,
  getCommentsById,
  getArticles,
  deleteArticleById,
  postArticle
};
