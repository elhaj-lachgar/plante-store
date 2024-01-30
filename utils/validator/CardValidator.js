const prisma = require("../PrismaClient");
const ValidatorMiddleware = require("../../middleware/ValidatorMiddleware");
const { check, } = require("express-validator");

exports.CreateSetCardValidator = [
  check("data")
    .notEmpty()
    .withMessage("data is required")
    .isArray()
    .withMessage("not valid form data")
    .custom(async (value, { req }) => {
      let errors = [];
      let totalPrice = 0;
      const promise = value.map(async (plante) => {
        let data;
        try {
          data = await prisma.plante.findUnique({
            where: { id: plante.id },
          });
        } catch (e) {
          errors.push(e.toString);
          throw new Error(e.toString());
        }
        totalPrice += data.price * plante.quantity;
        return req.user?.Card?.id
          ? {
              cardId : req.user.Card.id,
              planteId: data.id,
              quantity: plante.quantity,
            }
          : {
              planteId: data.id,
              quantity: plante.quantity,
            };
      });

      const plantes = await Promise.all(promise);


      if (errors.length > 0)
        throw new Error("make sure about plante you choose");

      req.body.info = plantes;
      req.body.totalPrice = totalPrice;
      return true;
    }),
  ValidatorMiddleware,
];


