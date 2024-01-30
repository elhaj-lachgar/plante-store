const express = require("express");
const router = express.Router();

const {
  CreateCategoryService,
  GetCategorysService,
  DeleteCategoryService,
  GetCategoryService,
  UpdateCategoryService,
} = require("../services/CategoryService");

const { AuthService, AllowdTo } = require("../services/AuthService");

const { Clouding } = require("../services/CloudService");

const { UploadeHandler, upload } = require("../middleware/multerMiddleware");

const {
  CreateCategoryValidator,
  DeleteCategoryValidator,
  GetCategoryValidator,
  UpdateCategoryValidator,
} = require("../utils/validator/CategoryValidator");

router
  .route("/")
  .post(
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("category"),
    UploadeHandler("category"),
    Clouding("category","imageUrl"),
    CreateCategoryValidator,
    CreateCategoryService
  )
  .get(GetCategorysService);

router
  .route("/:id")
  .delete(
    AuthService,
    AllowdTo("ADMIN"),
    DeleteCategoryValidator,
    DeleteCategoryService
  )
  .put(
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("category"),
    UploadeHandler("category"),
    Clouding("category","imageUrl"),
    UpdateCategoryValidator,
    UpdateCategoryService
  )
  .get(GetCategoryValidator, GetCategoryService);

module.exports = router;
