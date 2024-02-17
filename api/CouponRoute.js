const express = require("express");
const router = express.Router();

const {
  CreateCouponService,
  DeleteCouponService,
  GetCouponService,
  GetCouponsService,
} = require("../services/CouponService");
const { AllowdTo, AuthService } = require("../services/AuthService");

const {
  CreateCouponValidator,
  DeleteCouponValidator,
  GetCouponValidator,
} = require("../utils/validator/CouponValidator");

router.post(
  "/",
  AuthService,
  AllowdTo("ADMIN"),
  CreateCouponValidator,
  CreateCouponService
);

router.delete(
  "/:id",
  AuthService,
  AllowdTo("ADMIN"),
  DeleteCouponValidator,
  DeleteCouponService
);

router.get("/:code", GetCouponValidator, GetCouponService);

router.get("/", GetCouponsService);

module.exports = router;
