const { Customer } = require("../models/Customer");
const { Order } = require("../models/Order");

const fetchCustomers = () => {
  return Customer.find().select("_id");
};

const getCustomerOrdersCount = (customerId) => {
  return Order.find({ customer: customerId }).count();
};

const setCustomerOrdersCount = async () => {
  const customers = await fetchCustomers();
  for (customer of customers) {
    const ordersCount = await getCustomerOrdersCount(customer._id);
    customer.ordersCount = ordersCount;
    await customer.save();
  }

  console.log("Done...");
};

module.exports.fetchCustomers = fetchCustomers;
module.exports.getCustomerOrdersCount = getCustomerOrdersCount;
module.exports.setCustomerOrdersCount = setCustomerOrdersCount;
