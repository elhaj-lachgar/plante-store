// application
const express = require("express");
const app = express();

// dependencies
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

// coded
const RouteUndefinded = require("./middleware/Undefined");
const UnhandlerError = require("./config/UnhandlerError");
const ErrorMiddlwareHandler = require("./middleware/ErrorRoute");
const AuthRoute = require("./api/AuthRoute");
const PlanetRoute = require("./api/PlanetRoute");
const CategoryRoute = require("./api/CategoryRoute");
const CardRoute = require("./api/CardRoute");
const AddressRoute = require("./api/AddressRoute");
const CheckoutRoute = require("./api/PayementRoute");
const stripe = require("stripe")(process.env.STRIPE);

// configuration
dotenv.config({ path: ".env" });

app.use(cors());
app.options("*", cors());

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
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

    // Handle the event

    if (event.type == "payment_intent.succeeded") {
      console.log(event.data.object);
    }

    // Return a 200 response to acknvowledge receipt of the event
    res.send();
  }
);

app.use(express.json({ limit: "200kb" }));

app.use(morgan("dev"));

app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/plante", PlanetRoute);
app.use("/api/v1/category", CategoryRoute);
app.use("/api/v1/card", CardRoute);
app.use("/api/v1/location", AddressRoute);
app.use("/api/v1/checkout", CheckoutRoute);

app.all("*", RouteUndefinded);

app.use(ErrorMiddlwareHandler);

const server = app.listen(process.env.PORT);

process.on("unhandledRejection", (err) => UnhandlerError(server, err));
