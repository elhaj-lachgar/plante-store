const expressAsyncHandler = require('express-async-handler');
const prisma = require('../utils/PrismaClient');

exports.CreateOrderService = expressAsyncHandler ( async ( req , res , next ) => {
    const order = await prisma.userOrder.create({
        data: { ...req.body.object}
    })
    return res.status(201).json({data: order});
})