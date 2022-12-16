const cloudinary = require("cloudinary").v2;
const config = require("config");

// const uploadConfig = {
//   api_key: config.get("cloudinary.api_key"),
//   api_secret: config.get("cloudinary.api_secret"),
//   cloud_name: config.get("cloudinary.cloud_name"),
// };
const uploadConfig = {
  api_key: config.get("cloudinary.api_key") || process.env.API_KEY,
  api_secret: config.get("cloudinary.api_secret") || process.env.API_SECRET,
  cloud_name: config.get("cloudinary.cloud_name") || process.env.CLOUD_NAME,
};

const deleteFile = (public_id) => {
  return cloudinary.uploader.destroy(public_id, uploadConfig);
};

module.exports = { deleteFile };
