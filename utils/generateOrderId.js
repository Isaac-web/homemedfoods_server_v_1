module.exports = (customerId, orderId) => {
  const customerIdInt = parseInt(customerId);
  const orderIdInt = parseInt(orderId);
  const hour = new Date().getHours();

  return `${customerIdInt}${orderIdInt}`;
};



const test = () => {
  "day-hour-minute-sec-user_id";
  "00-00-00-00";
};
