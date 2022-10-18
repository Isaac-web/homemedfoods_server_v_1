const config = require("config");
const debugdb = require("debug")("db");
const mongoose = require("mongoose");

module.exports = (app) => {
  const port = process.env.PORT || config.get("port");

  mongoose
    .connect(config.get("db"))
    .then(() => {
      debugdb(
        `mongodb+srv://digimart_test:Just_Testing...@cluster0.ni0ol.mongodb.net/digimart_test`
      );
      if (app.get("env") !== "test")
        app.listen(port, () => console.info(`Listening on port ${port}...`));
    })
    .catch((err) => console.error(err.message, err));
};
