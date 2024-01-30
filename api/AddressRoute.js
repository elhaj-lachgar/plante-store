const express = require("express");
const router = express.Router();

const {
  CreateAddressService,
  DeleteAddressService,
  GetUserAddressService,
  UpdateAddressService,
} = require("../services/AddressService");

const {
  CreateAddressValidator,
  DeleteAddressValidator,
  UpdateAddressValidator,
} = require("../utils/validator/AddressValidator");
const { AllowdTo, AuthService } = require("../services/AuthService");

router
  .route("/")
  .get(AuthService, AllowdTo("USER", "ADMIN"), GetUserAddressService)
  .post(
    AuthService,
    AllowdTo("USER", "ADMIN"),
    CreateAddressValidator,
    CreateAddressService
  );

router
  .route("/:id")
  .delete(
    AuthService,
    AllowdTo("USER", "ADMIN"),
    DeleteAddressValidator,
    DeleteAddressService
  )
  .put(
    AuthService,
    AllowdTo("USER", "ADMIN"),
    UpdateAddressValidator,
    UpdateAddressService
  );

module.exports = router;
