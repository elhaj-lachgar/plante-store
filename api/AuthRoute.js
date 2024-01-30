const express = require("express");
const router = express.Router();

const {
  SignUpValidator,
  SingInValidator,
  ChangePasswordValidator,
  UpdateProfileValidator,
} = require("../utils/validator/AuthValidator");

const {
  SignUpService,
  SignInService,
  ChangePasswordService,
  AllowdTo,
  AuthService,
  UpdateProfileService,
} = require("../services/AuthService");

const { Clouding } = require("../services/CloudService");

const { UploadeHandler, upload } = require("../middleware/multerMiddleware");

router.post("/sign-in", SingInValidator, SignInService);

router.post(
  "/sign-up",
  upload.single("image"),
  UploadeHandler("avatar"),
  Clouding("avatar", "profile"),
  SignUpValidator,
  SignUpService
);

router.put(
  "/change-password",
  AuthService,
  AllowdTo("USER", "ADMIN"),
  ChangePasswordValidator,
  ChangePasswordService
);

router.put(
  "/update-profile",
  AuthService,
  AllowdTo("USER", "ADMIN"),
  upload.single("image"),
  UploadeHandler("avatar"),
  Clouding("avatar", "profile"),
  UpdateProfileValidator,
  UpdateProfileService
);


module.exports = router
