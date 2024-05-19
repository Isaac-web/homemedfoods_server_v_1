const { WebClient } = require('@slack/web-api');

const client = new WebClient(process.env.SLACK_XOXB_TOKEN);

async function sendMessage(channel, text) {
  try {
    const response = await client.chat.postMessage({
      channel: channel,
      text: text,
    });
  } catch (error) {
    console.error(`Error posting message: ${error}`);
  }
}

const getOrderItems = (order) => {
  const orderItems = order.order_items;

  let str = '';
  orderItems.forEach((item) => {
    str += `
	Item: ${item.productName}
	Price: Ghc${
    item.optionalPrice
      ? item.optionalPrice.toFixed(2)
      : item.unitPrice.toFixed(2)
  }
	Quantity: ${item.quantity}
	Sub Total: Ghc${item.subtotal.toFixed(2)}	
	`;
  });

  return str;
};

const notifySlackOnNewOrder = async ({ order, customer }) => {
  const message = `

  NEW ORDER

  Date: ${new Date(order.createdAt).toLocaleString()}
  Order ID: ${order.orderId}
  SubTotal: Ghc${order.subtotal.toFixed(2)}
  Delivery Fee: Ghc${order.deliveryFee.toFixed(2)}
  Total: Ghc${order.total.toFixed(2)}

  
  Order Items:
  ${getOrderItems(order)}
  

  Customer Details:

	Name: ${customer.name}
	Phone: ${customer.phone}
	Email: ${customer.email}
  `;

  await sendMessage(process.env.SLACK_CHANNEL_ID, message);
};

module.exports.notifySlackOnNewOrder = notifySlackOnNewOrder;
