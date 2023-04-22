const express = require("express");

//congiguration for environmental variables
require("dotenv").config();

//Exoress app instance
const app = express();

require("./startup/exceptions")(app); //Uncaught exceptions
require("./startup/middleware")(app); //middlewares
require("./startup/routes")(app); //api routes
require("./startup/connections")(app); //port and db connection
require("./startup/error")(app); //error catching mechanism in api routes

module.exports = app;