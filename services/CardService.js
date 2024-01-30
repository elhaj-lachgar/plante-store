const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");
const ErrorHandler = require("../utils/ErrorFeature");
const { $Enums } = require("@prisma/client");
const ErrorHandling = require("../utils/ErrorFeature");

// exports.CreateCardService = expressAsyncHandler(async (req, res, next) => {
//   let card;
//   let isNew = false;
//   if (req.user?.Card?.id) {
//     card = await prisma.card.findUnique({
//       where: { userId: req.user.id },
//       include: {
//         cardItem: {
//           include: {
//             plante: {
//               select: {
//                 name: true,
//                 price: true,
//                 currency: true,
//               },
//             },
//           },
//         },
//       },
//     });
//   } else {
//     isNew = true;
//     card = await prisma.card.create({
//       data: {
//         userId: req.user.id,
//         cardItem: {
//           createMany: {
//             data: req.body.info,
//           },
//         },
//         totalPrice: req.body.totalPrice,
//       },
//       include: {
//         cardItem: {
//           include: {
//             plante: {
//               select: {
//                 name: true,
//                 price: true,
//                 currency: true,
//               },
//             },
//           },
//         },
//       },
//     });
//   }

//   return res.status(200).json({ data: card, isNew });
// });

// exports.AddItemToCardService = expressAsyncHandler(async (req, res, next) => {
//   try {
//     let cardItem = null;
//     try {
//       cardItem = await prisma.cardItem.findUnique({
//         where: {
//           cardId: req.user?.Card.id,
//           planteId: req.body.planteId,
//         },
//       });
//       if(cardItem){
//         cardItem  = await prisma.cardItem.update({where : {id : cardItem.id} ,data : {
//           quantity : cardItem.quantity + 1 ,
//         }})
//       }
//     } catch (err) {
//       if (!cardItem) {
//         cardItem = await prisma.cardItem.create({
//           data: {
//             cardId: req.user.Card.id,
//             planteId: req.body.planteId,
//             quantity: req.body.quantity || 1,
//           },
//         });
//       }
//     }

//     card = await prisma.card.findUnique({
//       where: {
//         id: req.user?.Card.id,
//         userId: req.user.id,
//       },
//       select: {
//         cardItem: true,
//       },
//     });
//   } catch (err) {
//     return next(new ErrorHandling(err?.message || err, 400));
//   }

//   return res.status(200).json({ data: card });
// });

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
        totalPrice : req.body.totalPrice
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
      },
    });
  }

  return res.status(200).json({ data: card, isNew });
});
