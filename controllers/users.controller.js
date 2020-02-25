const { fetchUserByUsername } = require("../models/users.models.js");

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(err => {
      next(err);
    });
}

module.exports = { getUserByUsername };
