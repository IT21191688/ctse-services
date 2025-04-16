import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "NaturaAyur",
    link: process.env.FRONTEND_URL || "http://localhost:3000",
  },
});

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

export function generateOrderConfirmationEmail(
  userName: string,
  orderId: string,
  orderItems: { name: string; quantity: number; price: number }[],
  totalPrice: number
): string {
  const itemDetails = orderItems.map((item) => ({
    item: `${item.name} x ${item.quantity}`,
    price: `$${item.price.toFixed(2)}`,
  }));

  return mailGenerator.generate({
    body: {
      name: userName,
      intro: "Your order has been received and is being processed.",
      table: {
        data: [
          ...itemDetails,
          { item: "Total Price", price: `$${totalPrice.toFixed(2)}` },
        ],
        columns: {
          // Customize the column
          customWidth: {
            item: "80%",
            price: "20%",
          },
          // Customize the column
          customAlignment: {
            price: "right",
          },
        },
      },
      action: {
        instructions:
          "You can check the status of your order and more details here:",
        button: {
          color: "#22BC66",
          text: "View Order Details",
          link: `${frontendUrl}/orders/${orderId}`,
        },
      },
      outro:
        "We thank you for your purchase and look forward to serving you again!",
    },
  });
}

export function generateOrderStatusUpdateEmail(
  userName: string,
  orderId: string,
  status: string
): string {
  return mailGenerator.generate({
    body: {
      name: userName,
      intro: `Your order (${orderId}) has been updated to: ${status.toUpperCase()}`,
      action: {
        instructions: "You can check the latest status and details here:",
        button: {
          color: "#3869D4",
          text: "View Order Details",
          link: `${frontendUrl}/orders/${orderId}`,
        },
      },
      outro: "Thank you for shopping with us!",
    },
  });
}

export function generateOrderShippedEmail(
  userName: string,
  orderId: string,
  trackingNumber?: string
): string {
  const body: any = {
    name: userName,
    intro: `Great news! Your order (${orderId}) has been shipped.`,
    action: {
      instructions: "You can check the status and details here:",
      button: {
        color: "#22BC66",
        text: "View Order Details",
        link: `${frontendUrl}/orders/${orderId}`,
      },
    },
    outro: "We hope you enjoy your purchase!",
  };

  if (trackingNumber) {
    body.action.instructions = `Your tracking number is: ${trackingNumber}. You can check the status and details here:`;
  }

  return mailGenerator.generate({ body });
}
