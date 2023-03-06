const AWS = require("aws-sdk");

// AWS.config.update({
//   region: "us-east-1",
//   accessKeyId: "AKIAYFQ7ND4OJBNP4JZY",
//   securedAccessKey: "vMfOp7gXiUE7gX1Eh5Ogx1DIg1P/Rfcxyth1Bh4V",
// });

const createSnsTopic = () => {
  return new Promise((resolve, reject) => {
    try {
      const createTopic = new AWS.SNS({
        region: "us-east-1",
        accessKeyId: "",
        securedAccessKey: "",
        apiVersion: "2010-03-31",
      })
        .createTopic({ Name: "Digimart" })
        .promise();

      createTopic
        .then((data) => {
          console.log(`Topic created - ${topicName}`);
          console.log(`Data: ${data}`);
          resolve(data.TopicArn);
        })
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      reject(err);
    }
  });
};

createSnsTopic();
