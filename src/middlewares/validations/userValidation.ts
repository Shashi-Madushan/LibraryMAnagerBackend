import { body } from 'express-validator';

export const updateUserValidation = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('firstName')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 20 })
        .withMessage('First name must be less than 20 characters'),
    body('lastName')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Last name must be less than 20 characters')
];

export const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];
