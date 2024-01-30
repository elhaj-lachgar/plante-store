const express = require("express");
const router = express.Router();

const { AuthService, AllowdTo } = require("../services/AuthService");

const {
  GetCardService,
  SetCardService
} = require("../services/CardService");

const {
  CreateSetCardValidator
} = require("../utils/validator/CardValidator");

router.post(
  "/",
  AuthService,
  AllowdTo("USER", "ADMIN"),
  CreateSetCardValidator,
  SetCardService
);


router.get("/", AuthService, AllowdTo("USER", "ADMIN"), GetCardService);
module.exports = router;
