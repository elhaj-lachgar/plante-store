const express = require("express");
const router = express.Router();

const { AllowdTo, AuthService } = require("../services/AuthService");
const {
  DeleteOrderService,
  GetOrdersAdminService,
  GetUserOrderService,
  UpdateOrderServices,
} = require("../services/OrderService");


router
  .route('/:id')
  .put(AuthService , AllowdTo('ADMIN') , UpdateOrderServices)
  .delete(AuthService , AllowdTo('ADMIN') , DeleteOrderService);

router.get('/order-admin' , AuthService , AllowdTo("USER") , GetOrdersAdminService);
router.get('/order-user' , AuthService , AllowdTo('USER' ,'ADMIN') , GetUserOrderService);

module.exports = router;