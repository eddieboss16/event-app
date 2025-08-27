import { Router } from "express";
import { body } from "express-validator";

const router = Router();

// Registration validation
const registerValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Pasword must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('role').optional().isIn(['USER', 'ADMIN']).withMessage('Role must be USER or ADMIN'),
];

// Login validation
const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
];

// Routes
router.post('/register', registerValidation, )