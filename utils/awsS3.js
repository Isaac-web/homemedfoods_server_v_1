const config = require("config");
const AWS = require("aws-sdk");


const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "us-east-1",
  accessKeyId: config.get("awsS3.accessKeyId"),
  secretAccessKey: config.get("awsS3.secretAccessKey"),
});

const generateSignedUrl = ({
  operation = "putObject",
  Bucket = "digimartstorage",
  Key,
  ContentType,
}) => {
  const signedUrl = s3.getSignedUrl(operation, {
    Bucket,
    Key,
    ContentType,
  });

  return {
    signedUrl,
    publicId: Key,
    url: `${"https://digimartstorage.s3.amazonaws.com"}/${Key}`,
  };
};

const deleteFile = ({ Bucket = "digimartstorage", Key }) => {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket, Key }, (err) => {
      if (err) {
        reject({
          status: false,
          message: "An error occured while deleting the file.",
          error: err,
        });
      }

      resolve({
        status: true,
        message: "File deleted successfully.",
      });
    });
  });
};

module.exports.generateSignedUrl = generateSignedUrl;
module.exports.deleteFile = deleteFile;
