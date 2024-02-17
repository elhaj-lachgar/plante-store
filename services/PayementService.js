const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");
const ErrorHandling = require("../utils/ErrorFeature");
const stripe = require("stripe")(process.env.STRIPE);

exports.CreateLineItems = expressAsyncHandler(async (req, res, next) => {
  const cardItems = await prisma.cardItem.findMany({
    where: { cardId: req.user.Card.id },
    include: { plante: true },
  });
  const persontage  = req.user.Card.coupon.percentage || 0;
  if (!cardItems) return next(new ErrorHandling("cart not found", 404));
    const line_items = cardItems.map((item) => {
    const totalPrice = parseInt((item.plante.discountPrice || item.plante.price) * 100);
    const unit_amount = totalPrice - ((totalPrice * persontage)/100);
    return {
      price_data: {
        currency: item.plante.currency,
        product_data: {
          name: item.plante.name,
          images: [item.plante.imageUrl],
          metadata: { product_id: item.plante.id },
        },
        unit_amount,
      },
      quantity: item.quantity,
    };
  });
  req.body.line_items = line_items;
  return next();
});

exports.CheckoutService = expressAsyncHandler(async (req, res, next) => {
  const location = await prisma.address.findUnique({
    where: { id: req.body.address, userId: req.user.id },
  });

  if (!location) return next(new ErrorHandling("address not found", 404));



  let session;
  try {
    session = await stripe.checkout.sessions.create({
      success_url: process.env.SUCESS_URL,
      mode: "payment",
      payment_method_types: ["card"],
      cancel_url:process.env.CANCELE_URL,
      customer_email: req.user.email,
      client_reference_id: req.user.Card.id,
      metadata: {
        address: location.id,
        coupon : req.user.Card.coupon.code,
      },
      line_items: req.body.line_items,
    });
  } catch (err) {
    return next(new ErrorHandling(err.message || err, 400));
  }
  return res.status(200).json({ url: session.url });
});

exports.WebhookService = expressAsyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.SUCRET_KEY_WEBHOOK
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type == "checkout.session.completed") {
    const { client_reference_id, customer_email, metadata } = event.data.object;
    req.body.object = {
      UserEmail: customer_email,
      cardId: client_reference_id,
      addressId: metadata.address,
    };
    return next();
  }
  return res.status(404).json({ message: "same thing gose wrong" });
});
