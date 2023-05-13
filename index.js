const express = require("express");


//congiguration for environmental variables
const config = require("config");

require("dotenv").config();

//Exoress app instance
const app = express();


require("./startup/exceptions")(app); //Uncaught exceptions
require("./startup/middleware")(app); //middlewares
require("./startup/routes")(app); //api routes
require("./startup/connections")(app); //port and db connection
require("./startup/error")(app); //error catching mechanism in api routes

// require("./utils/sendCustomerSms")();
// "db": "mongodb://0.0.0.0/home_med_dev",


module.exports = app;