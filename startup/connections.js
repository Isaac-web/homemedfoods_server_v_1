const config = require("config");
const debugdb = require("debug")("db");
const mongoose = require("mongoose");

module.exports = (app) => {
  const port = process.env.PORT || config.get("port");
  mongoose
    .connect(config.get("db"))
    .then(() => {
      debugdb(`Connected to mongodb: ${config.get("db")}`);
      if (app.get("env") !== "test")
        app.listen(port, () => console.info(`Listening on port ${port}...`));
    })
    .catch((err) => console.error(err.message, err));
};
