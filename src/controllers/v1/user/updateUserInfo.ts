import { Request, Response } from 'express';
import { User } from '@/models/User';
import logger from '@/lib/winston';

export const updateUserInfo = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user?.userId,
            { firstName, lastName, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found'
            });
        } else {
            res.status(200).json({ 
                message: 'User updated successfully',
                user 
            });
        }
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error updating user information'
        });
    }
};

export const updateUserById = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email } = req.body;
        const { userId } = req.params;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
             res.status(404).json({
                code: 'NotFound',
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({ 
            message: 'User updated successfully',
            user 
        });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error updating user information'
        });
    }
};
