/**
 * Node modules 
 */
import { body, cookie } from "express-validator";
import bcrypt from "bcrypt";

/**
 * Models 
 */
import { User } from "@/models/User";

export const registerValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email should be less than 50 characters')
        .isEmail()
        .withMessage('Invalid Email Address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error('User already exists');
            }
        }),
    // body('username')
    //     .trim()
    //     .notEmpty()
    //     .withMessage('Username is required')
    //     .isLength({ max: 20 })
    //     .withMessage('Username must be less than 20 characters')
    //     .custom(async (value) => {
    //         const userExists = await User.exists({ username: value });
    //         if (userExists) {
    //             throw new Error('Username already exists');
    //         }
    //     }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .optional()
        .isString()
        .withMessage('Role must be a string')
        .isIn(['admin', 'user'])
        .withMessage('Role must be either admin or user'),
    body('firstName')
        .optional()
        .isString()
        .withMessage('First name must be a string')
        .isLength({ max: 20 })
        .withMessage('First name must be less than 20 characters'),
    body('lastName')
        .optional()
        .isString()
        .withMessage('Last name must be a string')
        .isLength({ max: 20 })
        .withMessage('Last name must be less than 20 characters')
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email should be less than 50 characters')
        .isEmail()
        .withMessage('Invalid Email Address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (!userExists) {
                throw new Error('User email or password is invalid');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .custom(async (value, { req }) => {
            const { email } = req.body as { email: string };
            const user = await User.findOne({ email })
                .select('password')
                .lean()
                .exec();
            if (!user) {
                throw new Error('User email or password is invalid');
            }

            const isPasswordValid = await bcrypt.compare(value, user.password);
            if (!isPasswordValid) {
                throw new Error('User password is invalid');
            }
        })
];


export const refreshTokenValidation = [
    cookie('refreshToken').notEmpty()
        .withMessage('Refresh token required')
        .isJWT()
        .withMessage('invalid refresh token format')
]