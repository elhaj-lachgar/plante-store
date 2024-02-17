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
    express.json({limit:"100kb"}),
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("category"),
    UploadeHandler("category"),
    Clouding("category","imageUrl"),
    CreateCategoryValidator,
    CreateCategoryService
  )
  .get(express.json({limit:"1kb"}),GetCategorysService);

router
  .route("/:id")
  .delete(
    express.json({limit:"1kb"}),
    AuthService,
    AllowdTo("ADMIN"),
    DeleteCategoryValidator,
    DeleteCategoryService
  )
  .put(
    express.json({limit:"100kb"}),
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("category"),
    UploadeHandler("category"),
    Clouding("category","imageUrl"),
    UpdateCategoryValidator,
    UpdateCategoryService
  )
  .get(express.json({limit:"1kb"}),GetCategoryValidator, GetCategoryService);

module.exports = router;
