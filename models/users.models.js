const connection = require("../db/connection.js");

function fetchAllUsers() {
  return connection
    .select("*")
    .from("users")
    .then(allUsers => {
      return allUsers;
    });
}

function createAUser(username, avatar_url, name) {
  return connection("users")
    .insert({
      username: username,
      avatar_url: avatar_url,
      name: name
    })
    .into("users")
    .returning("*")
    .then(newUser => {
      return newUser;
    });
}

function fetchUserByUsername(username) {
  const regex = /\d/g;

  if (regex.test(username)) {
    return Promise.reject({ msg: "Bad Request", status: 400 });
  }

  return connection
    .select("*")
    .from("users")
    .where("username", "=", username)
    .returning("*")
    .then(usersResult => {
      if (usersResult.length === 0) {
        return Promise.reject({ msg: "Username not found", status: 404 });
      }
      return usersResult[0];
    });
}

module.exports = { fetchAllUsers, createAUser, fetchUserByUsername };
