const ValidatorMiddleware = require("../../middleware/ValidatorMiddleware");
const { check } = require("express-validator");

exports.CreateCategoryValidator = [
  check("name").notEmpty().withMessage(" name is required"),

  ValidatorMiddleware,
];

exports.DeleteCategoryValidator = [
  check("id").notEmpty().withMessage(" id is required"),
  ValidatorMiddleware,
];

exports.UpdateCategoryValidator = [
  check("id").notEmpty().withMessage(" id is required"),
  ValidatorMiddleware,
]

exports.GetCategoryValidator = [
  check("id").notEmpty().withMessage(" id is required"),
  ValidatorMiddleware,
];
