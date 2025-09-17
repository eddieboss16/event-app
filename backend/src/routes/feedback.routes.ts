import { Router } from 'express';
import { body } from 'express-validator';
import {
  submitFeedback,
  getEventFeedback,
  getUserFeedback,
} from '../controllers/feedback.controllers';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';

const router = Router();

// Feedback validation
const feedbackValidation = [
  body('eventId').isUUID().withMessage('Valid event ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters'),
];

// Routes
router.post('/', authenticate, feedbackValidation, validateRequest, submitFeedback);
router.get('/my', authenticate, getUserFeedback);
router.get('/event/:eventId', getEventFeedback);

export default router;