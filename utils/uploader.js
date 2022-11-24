const cloudinary = require("cloudinary").v2;

const config = {
  api_key: "622534129641649",
  api_secret: "a-dkeyhieUIr1ZLqDSPHJUe-1x8",
  cloud_name: "don6m08ed",
};

const deleteFile = (public_id) => {
  return cloudinary.uploader.destroy(public_id, config);
};

module.exports = { deleteFile };
