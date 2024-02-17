const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");
const ErrorHandling = require("../utils/ErrorFeature");
const GetFeature = require("../utils/GetFeatures");
const cloudinary = require("cloudinary").v2;
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

exports.CreatePlanteService = expressAsyncHandler(async (req, res, next) => {
  req.body.image = undefined;
  const plante = await prisma.plante.create({
    data: req.body,
  });
  return res.status(201).json({ data: plante, message: "success created" });
});

exports.GetPlantesService = expressAsyncHandler(async (req, res, next) => {
  const feature = new GetFeature();
  const data = await feature.findMany("plante", req.query, "category");
  return res.status(200).json({ data });
});

exports.UpdatePlanteService = expressAsyncHandler(async (req, res, next) => {
  req.body.image = undefined;
  if (req.body.imageUrl) {
    const save = await prisma.plante.findUnique({
      where: { id: req.params.id },
    });

    if (save?.imageUrl) {
      const image = [save.imageUrl.split("/")[7], save.imageUrl.split("/")[8]]
        .join("/")
        .split(".")[0];
      await cloudinary.api
        .delete_resources([image], {
          type: "upload",
          resource_type: "image",
        })
        .then((res) => {
          console.log(res.toString());
        });
    }
  }
  const plante = await prisma.plante.update({
    where: { id: req.params.id },
    data: req.body,
  });

  if (!plante) return next(new ErrorHandling("plante not found", 404));
  return res.status(200).json({ data: plante });
});

exports.DeletePlanteService = expressAsyncHandler(async (req, res, next) => {
  const plante = await prisma.plante.delete({ where: { id: req.params.id } });
  if (!plante) return next(new ErrorHandling("Plante not found", 404));
  return res
    .status(200)
    .json({ success: true, message: "Plante successfully deleted" });
});

exports.GetPlanteService = expressAsyncHandler(async (req, res, next) => {
  const plante = await prisma.plante.findUnique({
    where: { id: req.params.id },
    include: {
      _count: true,
      Review: {
        include: {
          user: {
            select: {
              id : true,
              email: true,
              name: true,
              profile: true,
            },
          },
        },
      },
    },
  });
  if (!plante) return next(new ErrorHandling("plante not found"), 404);
  return res.status(201).json({ data: plante });
});
