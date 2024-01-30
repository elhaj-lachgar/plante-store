const ValidatorMiddleware = require("../../middleware/ValidatorMiddleware");
const { check} = require("express-validator");
const prisma = require("../PrismaClient");

exports.SignUpValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email not valid")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (user) throw new Error(`User${value} is already used`);
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ max: 16, min: 8 })
    .withMessage("password must be  between 16 and 8 characters"),

  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 10, min: 3 })
    .withMessage("name must be between 10 and 3 characters"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .custom((value, { req }) => {
      const isValid = value == req.body.password;
      if (!isValid) throw new Error("Confirm password is incorrect");
      return true;
    }),

  ValidatorMiddleware,
];

exports.SingInValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email not valid"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ max: 16, min: 8 })
    .withMessage("password must be  between 16 and 8 characters"),

  ValidatorMiddleware,
];

exports.ChangePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("currentPassword is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("currentPassword must be between 8 and 16 characters"),

  check("newPassword")
    .notEmpty()
    .withMessage("currentPassword is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("currentPassword must be between 8 and 16 characters"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("currentPassword is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("currentPassword must be between 8 and 16 characters")
    .custom((value, { req }) => {
      const valid = value == req.body.newPassword;
      if (!valid) throw new Error("password not match");
      return true;
    }),
];

exports.UpdateProfileValidator = [
  check("email")
    .optional()
    .isEmail()
    .withMessage("email not valid")
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (user) throw new Error(`User${value} is already used`);
      return true;
    }),

  check("name")
    .optional()
    .isLength({ max: 10, min: 3 })
    .withMessage("name must be between 10 and 3 characters"),

  ValidatorMiddleware,
];
