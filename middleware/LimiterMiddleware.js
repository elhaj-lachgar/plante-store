const { rateLimit } = require("express-rate-limit");

const limiter = (time, limit) =>
  rateLimit({
    windowMs: time * 60 * 1000,
    limit: limit,
    message: {
      err: "Too many requests please try again after" + time + "minutes",
      field: 400,
    },
  });

module.exports = limiter;
