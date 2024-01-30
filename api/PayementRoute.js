const express = require("express");
const router = express.Router();

const {
  CheckoutService,
  CreateLineItems,
} = require("../services/PayementService");

const { AllowdTo, AuthService } = require("../services/AuthService");



router.post('/' , AuthService ,AllowdTo("USER","ADMIN") , CreateLineItems , CheckoutService);


module.exports = router;