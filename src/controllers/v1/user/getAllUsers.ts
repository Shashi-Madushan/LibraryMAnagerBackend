import { Request, Response, RequestHandler } from 'express';
import { User } from '@/models/User';
import logger from '@/lib/winston';

export const getAllUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ 
            count: users.length,
            users 
        });
    } catch (error) {
        logger.error('Error fetching all users:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error fetching users'
        });
    }
};
