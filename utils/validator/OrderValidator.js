const { check } = require("express-validator");
const ValidatorMiddleware = require("../../middleware/ValidatorMiddleware");

exports.UpdateOrderValidator = [
  check("id").notEmpty().withMessage(" id is required"),
  check("date")
    .notEmpty()
    .withMessage(" date is required")
    .custom((value, { req }) => {
      const regxdate = new RegExp(
        /(18|19|20)\d{2}\-(0[1-9]|1[0,1,2])\-(0[1-9]|[12][0-9]|3[01])/
      );

      const Isvalid = regxdate.test(value);

      if (!Isvalid) throw new Error("date not valid form");
      const date = new Date(value);
      req.body.date = date;
      return true;
    }),
  ValidatorMiddleware,
];

exports.DeleteOrderValidator = [
    check("id").notEmpty().withMessage(" id is required"),
]
