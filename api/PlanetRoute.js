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
  .get(express.json({ limit: "1kb" }), GetPlantesService)
  .post(
    express.json({ limit: "100kb" }),
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("plante"),
    UploadeHandler("plante"),
    Clouding("plante", "imageUrl"),
    CreatePlanteValidator,
    CreatePlanteService
  );

router
  .route("/:id")
  .delete(
    express.json({ limit: "1kb" }),
    AuthService,
    AllowdTo("ADMIN"),
    DeletePlanteValidator,
    DeletePlanteService
  )
  .put(
    express.json({ limit: "100kb" }),
    AuthService,
    AllowdTo("ADMIN"),
    upload.single("plante"),
    UploadeHandler("plante"),
    Clouding("plante", "imageUrl"),
    UpdatePlanteValidator,
    UpdatePlanteService
  )
  .get(express.json({ limit: "1kb" }), GetPlanteValidator, GetPlanteService);

module.exports = router;
