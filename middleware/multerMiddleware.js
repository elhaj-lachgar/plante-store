const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const MulterStorege = multer.memoryStorage();

exports.upload = multer({
  storage: MulterStorege,
});

exports.UploadeHandler = ( name  ) => async (req, res, next) => {
  if (req.file) {
    const { buffer } = req.file;
    const filename = `${uuidv4()}-${Date.now()}.jpg`;
    await ModufieImages(buffer, filename , name );
    req.body.image = filename;
  }
  return next();
};

const ModufieImages = async (buffer, filename , option) => {
    await sharp(buffer)
    .resize(200, 200)
    .toFormat("jpg")
    .toFile(path.join(__dirname, `../upload/${option}/${filename}`));
};