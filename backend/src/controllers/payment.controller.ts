import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId, ticketQuantity } = req.body;
    const userId = req.user!.userId;

    const result = await paymentService.createPaymentIntent({
      userId,
      eventId,
      ticketQuantity,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Create payment intent error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create payment intent',
    });
  }
};

export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentIntentId } = req.body;

    const payment = await paymentService.confirmPayment(paymentIntentId);

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: { payment },
    });
  } catch (error: any) {
    console.error('Confirm payment error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to confirm payment',
    });
  }
};

export const getPaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        userId, // Ensure user can only check their own payments
      },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            startTime: true,
            venue: true,
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
      return;
    }

    res.json({
      success: true,
      data: { payment },
    });
  } catch (error: any) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
    });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const payload = req.body;

    await paymentService.handleWebhook(signature, payload);

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Webhook error',
    });
  }
};

export const getUserPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { limit = 10, offset = 0 } = req.query;

    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            startTime: true,
            venue: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    res.json({
      success: true,
      data: { payments },
    });
  } catch (error: any) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
    });
  }
};