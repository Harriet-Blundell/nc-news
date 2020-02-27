const express = require("express");

const app = express();

const { apiRouter } = require("./router/apiRouter.js");

const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerErrors,
  send405Error
} = require("./error/index.js");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = { app };
