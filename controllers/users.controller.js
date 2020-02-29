const {
  fetchAllUsers,
  createAUser,
  fetchUserByUsername
} = require("../models/users.models.js");

function getAllUsers(req, res, next) {
  fetchAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(err => {
      next(err);
    });
}

function postAUser(req, res, next) {
  const { username, avatar_url, name } = req.body;

  createAUser(username, avatar_url, name)
    .then(user => {
      res.status(201).send({ user });
    })
    .catch(err => {
      next(err);
    });
}

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

module.exports = { getAllUsers, postAUser, getUserByUsername };
