const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");


exports.GetCardService = expressAsyncHandler(async (req, res, next) => {
  const card = await prisma.card.findUnique({
    where: { id: req.user?.Card.id, userId: req.user.id },
    include: {
      cardItem: true,
    },
  });

  return res.status(200).json({ data: card });
});

exports.SetCardService = expressAsyncHandler(async (req, res, next) => {
  let card;
  let isNew = false;
  if (req.user?.Card?.id) {
    const cardItem = await prisma.cardItem.deleteMany({
      where : {
        cardId : req.user.Card.id,
      }
    });
    
    const cardItems = await prisma.cardItem.createMany({
      data : req.body.info,
    });

    card = await prisma.card.update({
      where: { userId: req.user.id , id : req.user.Card.id },
      data : {
        totalPrice : req.body.totalPrice,
        couponId : req.body.couponId,
      },
      include: {
        cardItem: {
          include: {
            plante: {
              select: {
                name: true,
                price: true,
                currency: true,
              },
            },
          },
        },
        coupon : true,
      },
    })

  } else {
    isNew = true;
    card = await prisma.card.create({
      data: {
        userId: req.user.id,
        cardItem: {
          createMany: {
            data: req.body.info,
          },
        },
        totalPrice: req.body.totalPrice,
        couponId : req.body.couponId,
      },
      include: {
        cardItem: {
          include: {
            plante: {
              select: {
                name: true,
                price: true,
                currency: true,
              },
            },
          },
        },
        coupon : true
      },
    });
  }

  return res.status(200).json({ data: card, isNew });
});
