import { Router } from "express";
import { body } from "express-validator";
import {
     checkEventAvailability, 
     createEvent, 
     deleteEvent, 
     getEventById, 
     getEvents, 
     getEventStats, 
     updateEvent 
    } from "../controllers/events.controller";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { validateObjectIdParam } from "../middleware/custom-validation.middleware";

const router = Router();

// Event validation
const eventValidation = [
    body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
    body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
    body('category').trim().isLength({ min: 2, max: 50 }).withMessage('Category is required'),
    body('venue').trim().isLength({ min: 3, max: 200 }).withMessage('Venue must be 3-200 characters'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('totalTickets').isInt({ min: 1 }).withMessage('Total tickets must be at least 1'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),
];

// Update event validation (partial validation)
const updateEventValidation = [
    body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
    body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
    body('category').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Category is required'),
    body('venue').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Venue must be 3-200 characters'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('startTime').optional().isISO8601().withMessage('Valid start time is required'),
    body('endTime').optional().isISO8601().withMessage('Valid end time is required'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('totalTickets').optional().isInt({ min: 1 }).withMessage('Total tickets must be at least 1'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be valid'),
];

// Public routes
router.get('/', getEvents);
router.get('/:id', validateObjectIdParam('id'), validateRequest, getEventById);
router.get('/:eventId/availability', validateObjectIdParam('eventId'), validateRequest, checkEventAvailability);

// Admin routes
router.post('/', authenticate, requireAdmin, eventValidation, validateRequest, createEvent);
router.put('/:id', authenticate, requireAdmin, validateObjectIdParam('id'), updateEventValidation, validateRequest, updateEvent);
router.delete('/:id', authenticate, requireAdmin, validateObjectIdParam('id'), validateRequest, deleteEvent);
router.get('/:id/stats', authenticate, requireAdmin, validateObjectIdParam('id'), validateRequest, getEventStats);

export default router;