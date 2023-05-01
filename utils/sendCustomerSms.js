
const { Customer } = require("../models/Customer");
const { sendSms } = require("./sms");


module.exports = () => {
    Customer.find().select("phone -_id").then(async customers => {

        const numbers = customers.map(c => {
            const message = "How is home? It was wonderful having you around this semester. Take very good care of yourself and remember DIGIMART has got you when you come back to school. Tell family and friends about it.";
            sendSms(c.phone, message);
        });

        console.log("Done...");
    });
}
