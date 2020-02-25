const express = require("express");

const app = express();

const { apiRouter } = require("./router/apiRouter.js");

app.use(express.json());

app.use("/api", apiRouter);

// REFERENCE ERROR FUNCTIONS HERE TOO!

module.exports = { app };
