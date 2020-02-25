const userRouter = require("express").Router();

const { getUserByUsername } = require("../controllers/users.controller.js");

userRouter.route("/:username").get(getUserByUsername);

module.exports = { userRouter };
