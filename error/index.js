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

  const { msg, status } = err;

  if (err.code !== undefined) {
    res.status(status).send({ msg });
  }
}

module.exports = { handleCustomErrors, handlePSQLErrors };
