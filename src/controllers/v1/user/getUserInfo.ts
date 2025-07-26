import { Request, Response } from 'express';
import { User } from '@/models/User';
import logger from '@/lib/winston';

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?.userId).select('-password');
        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found'
            });
        } else {
            res.status(200).json({ user });
        }
    } catch (error) {
        logger.error('Error fetching user info:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error fetching user information'
        });
    }
};

export const getUserInfoByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email }).select('-password');
        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found'
            });
        } else {
            res.status(200).json({ user });
        }
    } catch (error) {
        logger.error('Error fetching user info by email:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error fetching user information by email'
        });
    }
};
