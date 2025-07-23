import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyAccessToken } from '@/lib/jwt';
import logger from '@/lib/winston';

// Extend Express Request type to include user information
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Access token is required'
        });
        return;
    }

    try {
        const decoded = await verifyAccessToken(token) as { userId: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
             res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token has expired'
            });
            return;
        }
        if (error instanceof JsonWebTokenError) {
             res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid access token'
            });
            return;
        }
        logger.error('Authentication error:', error);
         res.status(500).json({
            code: 'InternalServerError',
            message: 'Internal server error'
        });
        return;
    }
};

