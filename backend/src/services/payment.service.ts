import Stripe from 'stripe';
import { prisma } from '../config/database';
import { eventsService } from './events.services';
import { emailService } from './email.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

interface CreatePaymentIntentData {
  userId: string;
  eventId: string;
  ticketQuantity: number;
}

class PaymentService {
  async createPaymentIntent(data: CreatePaymentIntentData) {
    try {
      // Get event details
      const event = await prisma.event.findUnique({
        where: { id: data.eventId },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      // Check availability
      const availability = await eventsService.checkAvailability(data.eventId, data.ticketQuantity);
      if (!availability.available) {
        throw new Error('Not enough tickets available');
      }

      const amount = Math.round(event.price * data.ticketQuantity * 100); // Convert to cents

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: {
          userId: data.userId,
          eventId: data.eventId,
          ticketQuantity: data.ticketQuantity.toString(),
          eventTitle: event.title,
        },
      });

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: data.userId,
          eventId: data.eventId,
          amount: event.price * data.ticketQuantity,
          currency: 'USD',
          status: 'PENDING',
          paymentMethod: 'stripe',
          stripeIntentId: paymentIntent.id,
          ticketQuantity: data.ticketQuantity,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
        amount: payment.amount,
      };
    } catch (error: any) {
      console.error('Create payment intent error:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      // Get payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }

      // Update payment record
      const payment = await prisma.payment.update({
        where: { stripeIntentId: paymentIntentId },
        data: { status: 'COMPLETED' },
        include: {
          user: true,
          event: true,
        },
      });

      // Reserve tickets
      await eventsService.reserveTickets(payment.eventId, payment.ticketQuantity);

      // Send confirmation email
      await emailService.sendTicketConfirmation({
        user: payment.user,
        eventTitle: payment.event.title,
        eventDate: payment.event.date.toDateString(),
        eventTime: payment.event.startTime.toTimeString(),
        eventVenue: payment.event.venue,
        ticketQuantity: payment.ticketQuantity,
        totalAmount: payment.amount,
        paymentId: payment.id,
      });

      return payment;
    } catch (error: any) {
      console.error('Confirm payment error:', error);
      throw error;
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.confirmPayment(paymentIntent.id);
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          await prisma.payment.update({
            where: { stripeIntentId: failedPayment.id },
            data: { status: 'FAILED' },
          });
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error: any) {
      console.error('Webhook error:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();