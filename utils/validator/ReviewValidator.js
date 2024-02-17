const { PrismaClient } = require('@prisma/client')
const ValidatorMiddleware = require("../../middleware/ValidatorMiddleware");
const { check} = require("express-validator");
const prisma = new PrismaClient()

exports.CreateReviewValidator=[
    check('id')
    .notEmpty()
    .withMessage('planteId is required')
    .custom( async(value,{req}) => {
        const plante = await  prisma.plante.findUnique({where:{id: value}});
        if(!plante) throw new Error("Plante not found");
        req.body.plante = plante;
        return true;
    }),
    check('rating')
    .notEmpty()
    .withMessage('rating is required')
    .isNumeric()
    .withMessage("rating must be a number")
    .custom(value=>{
        const isValid = value >= 0 && value <= 5 ;
        if(!isValid) throw new Error("Invalid rating must be between 0 and 5");
        return true
    }),
    
    ValidatorMiddleware
]


exports.UpdateReviewValidator = [
    check('id')
    .notEmpty()
    .withMessage('Review id required')
]


exports.DeleteReviewValidator = [
    check('id')
    .notEmpty()
    .withMessage('Review id required')
]