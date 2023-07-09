const AWS = require("aws-sdk");

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
