const { check} = require('express-validator');
const ValidatorMiddleware = require("../../middleware/ValidatorMiddleware");



exports.CreateCouponValidator = [
    check('code')
    .notEmpty()
    .withMessage('code of coupon is required')
    .toUpperCase(),

    check('percentage')
    .notEmpty()
    .withMessage('percentage is required')
    .isNumeric()
    .withMessage('percentage is numeric')
    .custom((value)=>{
        const isValid = value <= 100 && value >= 0;
        if(!isValid) throw new Error('percentage must be between 0 and 100');
        return true;
    }),

    ValidatorMiddleware
]

exports.DeleteCouponValidator = [
    check('id').notEmpty().withMessage('id is require '),
]

exports.GetCouponValidator = [
    check("code").notEmpty().withMessage('code is required '),
    ValidatorMiddleware
]