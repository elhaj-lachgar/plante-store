const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.COLUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET_KEY,
  });
  
  
exports.CloudImage = (file, folder) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload(file, { folder: folder, resource_type: "auto" })
        .then((res) => {
          resolve({
              url : res.url,
              id : res.public_id
          });
        })
        .catch((err) => reject(err));
    });
  };