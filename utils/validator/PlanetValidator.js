const ValidatorMiddleware = require('../../middleware/ValidatorMiddleware');
const {check} = require('express-validator');


exports.CreatePlanteValidator = [
    check("name")
    .notEmpty()
    .withMessage("name is required"),

    check('categoryId')
    .notEmpty()
    .withMessage("categoryId is required"),

    check('price')
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price is numeric")
    .toFloat(),

    check("currency")
    .notEmpty()
    .withMessage("currency is required")
    .custom(value=>{
        const isValid = ["USD", "EUR"].includes(value);
        if(!isValid)  throw new Error("currency is not valid ");
        return true;
    }),
    check("discountPrice")
    .optional()
    .isNumeric()
    .withMessage("discountPrice is numeric")
    .toFloat(),

    ValidatorMiddleware,
]

exports.DeletePlanteValidator = [
    check("id")
    .notEmpty()
    .withMessage("id is required"),
    ValidatorMiddleware
]

exports.GetPlanteValidator = [
    check("id")
    .notEmpty()
    .withMessage("id is required"),
    ValidatorMiddleware
]

exports.UpdatePlanteValidator = [
    check("id")
    .notEmpty()
    .withMessage("id is required"),

    check('price')
    .optional()
    .isNumeric()
    .withMessage("price is numeric"),

    check("currency")
    .optional()
    .custom(value=>{
        const isValid = ["USD", "EUR"].includes(value);
        if(!isValid)  throw new Error("currency is not valid ");
        return true;
    }),

    check("discountPrice")
    .optional()
    .isNumeric()
    .withMessage("discountPrice is numeric"),

    ValidatorMiddleware,
]