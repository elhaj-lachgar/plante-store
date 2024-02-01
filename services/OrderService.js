const { PrismaClient } = require("@prisma/client");
const expressAsyncHandler = require("express-async-handler");
// const prisma = require('../utils/PrismaClient')
const prisma = new PrismaClient ();

exports.CreateOrderService = expressAsyncHandler(async (req, res, next) => {
const order = await prisma.order.create({
    data: {
        addressId : req.body.object.addressId,
        cardId : req.body.object.cardId ,
        userId : req.body.object.userId,
    }
  });
  return res.status(200).json({ data: order });
});




