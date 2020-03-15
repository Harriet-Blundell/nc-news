const express = require('express');

const app = express();

const apiRouter = require('./router/apiRouter.js');

const cors = require('cors');

const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerErrors,
  routeError
} = require('./error/index.js');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.use('/*', routeError);

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleServerErrors);

module.exports = app;
