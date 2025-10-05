import { Router } from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controllers';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { validateObjectId, validateObjectIdParam } from '../middleware/custom-validation.middleware';

const router = Router();

// Add to cart validation
const addToCartValidation = [
  validateObjectId('eventId'),
  body('quantity').optional().isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
];

// Update cart item validation
const updateCartItemValidation = [
  body('quantity').isInt({ min: 0, max: 10 }).withMessage('Quantity must be between 0 and 10'),
];

// Routes
router.get('/', authenticate, getCart);
router.post('/add', authenticate, addToCartValidation, validateRequest, addToCart);
router.put('/update/:id', authenticate, validateObjectIdParam('id'), updateCartItemValidation, validateRequest, updateCartItem);
router.delete('/remove/:id', authenticate, validateObjectIdParam('id'), validateRequest, removeFromCart);
router.delete('/clear', authenticate, clearCart);

export default router;