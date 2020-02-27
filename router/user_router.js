const userRouter = require("express").Router();

const { getUserByUsername } = require("../controllers/users.controller.js");

const { send405Error } = require("../error/index.js");

userRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(send405Error);

module.exports = { userRouter };
