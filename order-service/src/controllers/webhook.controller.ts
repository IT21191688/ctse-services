import { Request, Response } from "express";
import Stripe from "stripe";
import { processOrderPayment } from "../services/order.service";
import logger from "../config/logger.config";
import stripe from "../config/stripe.config";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    return res.status(400).json({ message: "Missing stripe-signature header" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    logger.error(`Webhook Error: ${error.message}`);
    return res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }

  // Handle different event types
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await processOrderPayment(session as any);
        break;
      }

      // Add more event handlers as needed
      case "payment_intent.succeeded": {
        logger.info("Payment intent succeeded event received");
        break;
      }

      case "payment_intent.payment_failed": {
        logger.warn("Payment intent failed event received");
        // Implement failed payment handling here
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error(`Error processing webhook: ${error.message}`);
    return res.status(500).json({ message: error.message });
  }
};
