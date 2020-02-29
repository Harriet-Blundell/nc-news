exports.checkForInvalidKeys = (req, res, next) => {
  const keys = Object.keys(req.query);

  const onlyKeys = ["sort_by", "order", "author", "topic"];

  for (let i = 0; i < keys.length; i++) {
    if (onlyKeys.includes(keys[i]) === false) {
      next({
        msg: "Not a valid query",
        status: 400
      });
    }
  }
  next();
};
