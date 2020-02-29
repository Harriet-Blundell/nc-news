const userRouter = require("express").Router();

const {
  getAllUsers,
  postAUser,
  getUserByUsername
} = require("../controllers/users.controller.js");

const { send405Error } = require("../error/index.js");

userRouter
  .route("/")
  .get(getAllUsers)
  .post(postAUser)
  .all(send405Error);

userRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = { userRouter };
