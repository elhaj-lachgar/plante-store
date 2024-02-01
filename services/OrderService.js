const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");

exports.CreateOrderService = expressAsyncHandler(async (req, res, next) => {
  const order = await prisma.order.create({
    data: { ...req.body.object },
    include: { user: true },
  });
  return res.status(200).json({data: order});
});
