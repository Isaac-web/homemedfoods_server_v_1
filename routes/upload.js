const express = require("express");
const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
const { generateSignedUrl } = require("../utils/awsS3");

const router = express.Router();

const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "us-east-1",
  accessKeyId: "AKIAYFQ7ND4OND3UTAQ3",
  secretAccessKey: "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",
});

router.get("/image", async (req, res) => {
  const { path, extension } = req.query;

  let filename = path ? path + "/" + uuid() : uuid();
  filename = extension ? `${filename}.${extension}` : `${filename}.jpg`;
  const result = generateSignedUrl({
    Bucket: "digimartstorage",
    Key: filename,
    ContentType: "image/*",
  });

  res.send(result);
});



module.exports = router;
