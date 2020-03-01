function handleCustomErrors(err, req, res, next) {
  const { msg, status } = err;

  if (err.status !== undefined) {
    res.status(status).send({ msg });
  } else {
    next(err);
  }
}

function handlePSQLErrors(err, req, res, next) {
  const psqlErrCodes = {
    "22P02": { msg: "Bad Request", status: 400 },
    "23503": { msg: "Not Found", status: 404 },
    "23502": { msg: "Bad Request", status: 400 },
    "42703": { msg: "Bad Request", status: 400 }
  };

  if (err.code !== undefined) {
    res
      .status(psqlErrCodes[err.code].status)
      .send({ msg: psqlErrCodes[err.code].msg });
  } else {
    next(err);
  }
}

function routeError(req, res, next) {
  res.status(404).send({ msg: "Page Not Found" });
}

function send405Error(req, res, next) {
  res.status(405).send({ msg: "Method Not Allowed" });
}

function handleServerErrors(err, req, res, next) {
  res.status(500).send({ msg: "Internal Server Error" });
}

module.exports = {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerErrors,
  send405Error,
  routeError
};
