const express = require("express");
const router = express.Router();

const {
  SignUpValidator,
  SingInValidator,
  ChangePasswordValidator,
  UpdateProfileValidator,
  AdminSignInValidator,
  UpdateRoleValidator,
} = require("../utils/validator/AuthValidator");

const {
  SignUpService,
  SignInService,
  ChangePasswordService,
  AllowdTo,
  AuthService,
  AdminLoginService,
  UpdateProfileService,
  GetUsersService,
} = require("../services/AuthService");

const { Clouding } = require("../services/CloudService");

const { UploadeHandler, upload } = require("../middleware/multerMiddleware");

const limiter = require("../middleware/LimiterMiddleware");

router.post(
  "/sign-up",
  limiter(60, 5),
  express.json({ limit: "100kb" }),
  upload.single("image"),
  UploadeHandler("avatar"),
  Clouding("avatar", "profile"),
  SignUpValidator,
  SignUpService
);

router.put(
  "/update-profile",
  express.json({ limit: "100kb" }),
  AuthService,
  AllowdTo("USER", "ADMIN"),
  upload.single("image"),
  UploadeHandler("avatar"),
  Clouding("avatar", "profile"),
  UpdateProfileValidator,
  UpdateProfileService
);

router.use(express.json({ limit: "1kb" }));

router.post("/sign-in", limiter(60, 5), SingInValidator, SignInService);
router.put(
  "/change-password",
  limiter(60, 5),
  AuthService,
  AllowdTo("USER", "ADMIN"),
  ChangePasswordValidator,
  ChangePasswordService
);

router.post(
  "/admin-login",
  limiter(60, 3),
  AdminSignInValidator,
  AdminLoginService
);

router.get("/get-users", AuthService, AllowdTo("ADMIN"), GetUsersService);

router.put(
  "/role-update/:id",
  AuthService,
  AllowdTo("ADMIN"),
  UpdateRoleValidator,
  UpdateProfileService
);

module.exports = router;
