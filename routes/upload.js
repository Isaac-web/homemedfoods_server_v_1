const express = require("express");
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const router = express.Router();

router.get("/image", async (req, res) => {
  const { path, extension } = req.query;

  const s3 = new AWS.S3({
    signatureVersion: "v4",
    region: "us-east-1",
    accessKeyId: "",
    secretAccessKey: "",
  });

  const filename = path ? path + "/" + uuid() : uuid();
  const url = s3.getSignedUrl("putObject", {
    Bucket: "digimartstorage",
    Key: extension ? `${filename}.${extension}` : `${filename}.jpg`,
    ContentType: "image/*",
  });

  res.send({
    filename,
    url,
  });
});

module.exports = router;
