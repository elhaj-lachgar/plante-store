const expressAsyncHandler = require("express-async-handler");
const prisma = require("../utils/PrismaClient");
const GetFeature = require("../utils/GetFeatures");
const ErrorHandling = require("../utils/ErrorFeature");
const cloudinary = require('cloudinary').v2

exports.CreateCategoryService = expressAsyncHandler(async (req, res, next) => {
  req.body.image = undefined;
  const category = await prisma.category.create({ data: req.body });
  return res
    .status(201)
    .json({ data: category, message: "category created successfully" });
});

exports.GetCategorysService = expressAsyncHandler(async (req, res, next) => {
  const feature = new GetFeature();
  const data = await feature.findMany("category", req.body);
  return res.status(200).json({ data });
});

exports.DeleteCategoryService = expressAsyncHandler(async (req, res, next) => {
  const category = await prisma.category.delete({
    where: { id: req.params.id },
  });
  if (!category) return next(new ErrorHandling("category not found", 404));
  return res.status(200).json({ category });
});

exports.GetCategoryService = expressAsyncHandler(async (req, res, next) => {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
  });
  if (!category) return next(new ErrorHandling("category not found", 404));
  return res.status(200).json({ data: category });
});

exports.UpdateCategoryService = expressAsyncHandler(async (req, res, next) => {
  req.body.image = undefined;

  if (req.body.imageUrl) {
    const save = await prisma.category.findUnique({
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
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: req.body,
  });
  if (!category) return next(new ErrorHandling("category not found", 404));
  return res.status(200).json({ data: category });
});
