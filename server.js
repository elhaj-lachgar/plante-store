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
const OrderRoute = require("./api/OrderRoute");
const ReviewRoute = require("./api/ReviewRoute");
const CouponRoute = require("./api/CouponRoute");
const { WebhookService } = require("./services/PayementService");
const { CreateOrderService } = require("./services/OrderService");
const { GetSearchResult } = require("./services/SearchService");

// configuration
dotenv.config({ path: ".env" });

// cors configuration
app.use(cors());
app.options("*", cors());

// tirggert of request
if (process.env.NODE_ENV == "dev") app.use(morgan("dev"));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  WebhookService,
  CreateOrderService
);


// search

app.get('/api/v1/search/:value' , GetSearchResult);

// auth routes
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/plante", PlanetRoute);
app.use("/api/v1/category", CategoryRoute);

app.use(express.json({ limit: "1kb" }));
app.use("/api/v1/card", CardRoute);
app.use("/api/v1/location", AddressRoute);
app.use("/api/v1/checkout", CheckoutRoute);
app.use("/api/v1/order", OrderRoute);
app.use("/api/v1/review", ReviewRoute);
app.use("/api/v1/coupon", CouponRoute);

app.all("*", RouteUndefinded);

app.use(ErrorMiddlwareHandler);

const server = app.listen(process.env.PORT);

process.on("unhandledRejection", (err) => UnhandlerError(server, err));
