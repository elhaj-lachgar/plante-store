const ValidatorMiddleware = require("../../middleware/ValidatorMiddleware");
const { check} = require("express-validator");


exports.CreateAddressValidator = [
    check('country')
    .notEmpty()
    .withMessage('country is required'),

    check('city')
    .notEmpty()
    .withMessage('city is required'),

    check('street')
    .notEmpty()
    .withMessage('street is required'),
 
    check('codePostal')
    .notEmpty()
    .withMessage('codePostal is required')
    .isNumeric()
    .withMessage('codePostal not numeric'),

    ValidatorMiddleware,
]

exports.DeleteAddressValidator =[
    check('id')
    .notEmpty()
    .withMessage('id is required'),
]

exports.UpdateAddressValidator =[
    check('id')
    .notEmpty()
    .withMessage('id is required'),
]


