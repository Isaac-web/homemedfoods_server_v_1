const cloudinary = require("cloudinary").v2;
const config = require("config");

// const uploadConfig = {
//   api_key: "622534129641649",
//   api_secret: "a-dkeyhieUIr1ZLqDSPHJUe-1x8",
//   cloud_name: "don6m08ed",
// };

const uploadConfig = {
  api_key: config.get("cloudinary.api_key"),
  api_secret: config.get("cloudinary.api_secret"),
  cloud_name: config.get("cloudinary.cloud_name"),
};

const deleteFile = (public_id) => {
  return cloudinary.uploader.destroy(public_id, uploadConfig);
};

module.exports = { deleteFile };
