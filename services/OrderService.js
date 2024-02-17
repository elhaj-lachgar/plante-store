const expressAsyncHandler = require("express-async-handler");
const prisma = require('../utils/PrismaClient');
const GetFeature = require("../utils/GetFeatures");
const ErrorHandling = require("../utils/ErrorFeature");


exports.CreateOrderService = expressAsyncHandler(async (req, res, next) => {
  const order = await prisma.userOrder.create({
    data: { ...req.body.object },
  });
  return res.status(201).json({ data: order });
});

exports.GetUserOrderService = expressAsyncHandler(async (req, res, next) => {
  const orders = await prisma.userOrder.findMany({
    where: { UserEmail: req.user.email },
    include: {
      card: {
        include: {
          cardItem: { include: { plante: { include: { category: true } } } },
        },
      },
      address: true,
    },
  });

  return res.status(200).json({ data: orders });
});

exports.UpdateOrderServices = expressAsyncHandler(async (req, res, next) => {
  const order = await prisma.userOrder.update({
    where: { id: req.params.id },
    data: {
      isDelaiverd: true,
      isDelaiverdAt: new Date(req.body.date),
    },
  });
  return res
    .status(200)
    .json({ success: true, message: "order updated successfully" });
});

exports.GetOrdersAdminService = expressAsyncHandler(async (req, res, next) => {
  const feature = new GetFeature();
  const { data, pagination } = await feature.findMany(
    "userOrder",
    req.query,
    "admin"
  );
  return res.status(200).json({ data, pagination });
});

exports.DeleteOrderService = expressAsyncHandler(async (req, res, next) => {
  const order = await prisma.userOrder.findUnique({
    where: { id: req.params.id },
  });
  if (!order.isDelaiverd)
    return next(new ErrorHandling("this order not delaiverd yet"));
  await prisma.userOrder.delete({ where: { id: req.params.id } });
  return res
    .status(200)
    .json({ success: true, message: "Order deleted successfully" });
});
