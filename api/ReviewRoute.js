const express = require("express");
const router = express.Router();

const {
  CreateReviewValidator,
  DeleteReviewValidator,
  UpdateReviewValidator,
} = require("../utils/validator/ReviewValidator");

const {
  CreateReviewService,
  DeleteReviewService,
  UpdateReviewService,
} = require("../services/ReviewService");

const {AuthService , AllowdTo} = require('../services/AuthService')



router
  .route('/:id')
  .put(AuthService ,AllowdTo("USER","ADMIN"), UpdateReviewValidator ,UpdateReviewService)
  .delete(AuthService ,AllowdTo("USER","ADMIN") , DeleteReviewValidator , DeleteReviewService);

router
  .post("/",AuthService , AllowdTo("USER","ADMIN") , CreateReviewValidator , CreateReviewService);


module.exports = router;
  