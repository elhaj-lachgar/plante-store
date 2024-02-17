const express = require("express");
const router = express.Router();

const { AllowdTo, AuthService } = require("../services/AuthService");
const {
  DeleteOrderService,
  GetOrdersAdminService,
  GetUserOrderService,
  UpdateOrderServices,
} = require("../services/OrderService");

const { DeleteOrderValidator , UpdateOrderValidator} = require('../utils/validator/OrderValidator');

router
  .route('/:id')
  .put(AuthService , AllowdTo('ADMIN') , UpdateOrderValidator,UpdateOrderServices)
  .delete(AuthService , AllowdTo('ADMIN') , DeleteOrderValidator, DeleteOrderService);

router.get('/order-admin' , AuthService , AllowdTo("ADMIN") , GetOrdersAdminService);
router.get('/order-user' , AuthService , AllowdTo('USER' ,'ADMIN') , GetUserOrderService);

module.exports = router;