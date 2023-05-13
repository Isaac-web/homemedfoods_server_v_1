
const { Customer } = require("../models/Customer");
const { sendSms } = require("./sms");




module.exports = () => {
    Customer.find().select("phone -_id").then(async customers => {
        const numbers = customers.map(c => {
            const message = "";
            sendSms(c.phone, message);
            // console.log(c.phone);
        });

        console.log("Done...");
    });

    // sendSms("+233553039567", "Welcome back. Order on digimart.page.link/download from today till Monday and get a free delivery. Use the code D-OEVWQ2V.");
}
