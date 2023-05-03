
const { Customer } = require("../models/Customer");
const { sendSms } = require("./sms");




module.exports = () => {
    Customer.find().select("phone -_id").then(async customers => {
        const numbers = customers.map(c => {
            const message = "May is a special month to us at Digimart and so all birthday cake orders for May are 20% discounted. Surprise Mummy this Mother's Day. For Kumasi orders use the Digimart app. For Accra orders text or call 0550420874.";
            sendSms(c.phone, message);
        });

        console.log("Done...");
    });
}
