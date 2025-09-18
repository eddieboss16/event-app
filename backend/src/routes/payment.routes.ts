import { Router } from 'express';
import express from 'express';
import { body } from 'express-validator';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  handleWebhook,
  getUserPayments,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

// Payment intent validation
const paymentIntentValidation = [
  body('eventId').isUUID().withMessage('Valid event ID is required'),
  body('ticketQuantity').isInt({ min: 1, max: 10 }).withMessage('Ticket quantity must be between 1 and 10'),
];

// Routes
router.post('/create-intent', authenticate, paymentIntentValidation, validateRequest, createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/status/:id', authenticate, getPaymentStatus);
router.get('/my', authenticate, getUserPayments);

// Webhook (no authentication required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;