module.exports = (customerId, orderId) => {
  const customerIdInt = parseInt(customerId);
  const orderIdInt = parseInt(orderId);
  const hour = new Date().getHours();

  return `${customerIdInt}${orderIdInt}`;
};
