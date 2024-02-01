const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");

exports.CreateOrderService = expressAsyncHandler(async (req, res, next) => {
  console.log(req.body.object);
  const order = await prisma.order.create({
    data: { ...req.body.object },
  });
  return res.status(200).json({ data: order });
});
