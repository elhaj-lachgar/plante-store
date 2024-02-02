const expressAsyncHandler = require('express-async-handler');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

exports.CreateOrderService = expressAsyncHandler ( async ( req , res , next ) => {
    const order = await prisma.userOrder.create({
        data: { ...req.body.object}
    })
    return res.status(201).json({data: order});
})