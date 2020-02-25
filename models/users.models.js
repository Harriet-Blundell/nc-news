const connection = require("../db/connection.js");

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
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ msg: "Username not found", status: 404 });
      }
      return result[0];
    });
}

module.exports = { fetchUserByUsername };
