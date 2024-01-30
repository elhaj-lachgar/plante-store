const express = require("express");
const router = express.Router();

const {
  CreatePlanteService,
  DeletePlanteService,
  GetPlantesService,
  GetPlanteService,
  UpdatePlanteService,
} = require("../services/PlanetService");

const { AuthService, AllowdTo } = require("../services/AuthService");

const { Clouding } = require("../services/CloudService");

const { UploadeHandler, upload } = require("../middleware/multerMiddleware");

const {
  CreatePlanteValidator,
  DeletePlanteValidator,
  GetPlanteValidator,
  UpdatePlanteValidator,
} = require("../utils/validator/PlanetValidator");

router
  .route("/")
  .get(GetPlantesService)
  .post(
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("plante"),
    UploadeHandler("plante"),
    Clouding("plante","imageUrl"),
    CreatePlanteValidator,
    CreatePlanteService
  );

router
  .route("/:id")
  .delete(
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("plante"),
    UploadeHandler("plante"),
    Clouding("plante","imageUrl"),
    DeletePlanteValidator,
    DeletePlanteService
  )
  .put(
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("plante"),
    UploadeHandler("plante"),
    Clouding("plante","imageUrl"),
    UpdatePlanteValidator,
    UpdatePlanteService
  )
  .get(GetPlanteValidator, GetPlanteService);

module.exports = router;
