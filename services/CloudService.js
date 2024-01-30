const expressAsyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const {CloudImage} = require('../utils/Cloudinary')


exports.Clouding = (folder , field ) => expressAsyncHandler (async (req, res, next) => {
    const image = req.body?.image;
    let profile;
    if (image) {
      const uploader = async (file) => CloudImage(file, folder);
      let newPath;
      try {
        newPath = await uploader(
          path.join(__dirname, `../upload/${folder}/${image}`)
        );
      } catch (err) {
        console.log(err);
      }
      fs.unlinkSync(path.join(__dirname, `../upload/${folder}/${image}`));
      if (!newPath.url) return next(new ErrorHandler("upload field"));
      else {
        profile = newPath.url;
        req.body[field] = profile;
      }
    }
    return next();
});