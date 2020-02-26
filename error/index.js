function handleCustomErrors(err, req, res, next) {
  console.log(err.status, "custom error");

  const { msg, status } = err;

  if (err.status !== undefined) {
    res.status(status).send({ msg });
  } else {
    next(err);
  }
}

function handlePSQLErrors(err, req, res, next) {
  console.log(err.code, "psql error");

  const psqlErrCodes = {
    "22P02": { msg: "Bad Request", status: 400 },
    "23503": { msg: "Not Found", status: 404 },
    "23502": { msg: "Bad Request", status: 400 }
  };

  if (err.code !== undefined) {
    res
      .status(psqlErrCodes[err.code].status)
      .send({ msg: psqlErrCodes[err.code].msg });
  } else {
    next(err);
  }
}

module.exports = { handleCustomErrors, handlePSQLErrors };
