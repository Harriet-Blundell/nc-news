const articleRouter = require("express").Router();

const { getArticleId } = require("../controllers/article.controller.js");

articleRouter.route("/:article_id").get(getArticleId);

module.exports = { articleRouter };
