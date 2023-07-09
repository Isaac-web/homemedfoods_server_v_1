const fs = require("fs");
const mongoose = require("mongoose");
const { Customer } = require("../models/Customer");

console.log("Connecting to mongodb....");
mongoose
  .connect("")
  .then(() => {
    console.log("Connected to mongodb....");
    fetchCustomers();
  })
  .catch((err) => console.log("Failed to connect."));

const writeToFile = (data) => {
  fs.writeFile("contacts.csv", data, { encoding: "utf8" }, (err) => {
    if (err) {
      console.log("Could not write to file.");
    }
  });
};

const fetchCustomers = async () => {
  const customers = await Customer.find().select("firstname lastname phone");

  let str = "";
  for (let c of customers) {
    const name = c.firstname + " " + c.lastname;
    const contact = c.phone;

    const contactString = `${name} - Digimart, ${contact}\n`;
    str += contactString;
  }
  writeToFile(str);
  console.log(`\n ${customers.length} customers read.`);
};
