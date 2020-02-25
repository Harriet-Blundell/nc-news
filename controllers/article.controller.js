const { fetchArticleId } = require("../models/article.models");

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

module.exports = { getArticleId };
