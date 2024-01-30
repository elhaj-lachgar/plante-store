const { validationResult } = require("express-validator");

const ValidatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  return next();
};

module.exports = ValidatorMiddleware;
