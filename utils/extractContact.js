const fs = require("fs");
const mongoose = require("mongoose");
const { Customer } = require("../models/Customer");

console.log("Connecting to mongodb....");
mongoose
  .connect(
    "mongodb+srv://digimart:2W874t9kNB3u6ej5@digimart-db-storage-46ab3fcb.mongo.ondigitalocean.com/digimart?authSource=admin&replicaSet=digimart-db-storage&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
  )
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
