const description = require("../endpoints.json");

function getDescriptionEndpoint(req, res, next) {
  res.status(200).send({ description });
}

module.exports = { getDescriptionEndpoint };
