const {
  fetchArticleId,
  updateArticleVote,
  createArticleComment
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
  createArticleComment(req.params.article_id, req.body).then(comment => {
    res.status(201).send({ comment });
  });
}

module.exports = { getArticleId, patchArticleVote, postArticleComment };
