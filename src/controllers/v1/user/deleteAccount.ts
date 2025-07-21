import { Request, Response } from 'express';
import { User } from '@/models/User';
import Token from '@/models/token';
import logger from '@/lib/winston';

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?.userId);
        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found'
            });
        } else {
            await Token.deleteMany({ userId: req.user?.userId });
            await User.findByIdAndDelete(req.user?.userId);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            res.status(200).json({
                message: 'Account deleted successfully'
            });
        }
    } catch (error) {
        logger.error('Error deleting account:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error deleting account'
        });
    }
};

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) {
             res.status(404).json({
                code: 'NotFound',
                message: 'User not found'
            });
            return;
        }

        await Token.deleteMany({ userId });
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting user:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error deleting user'
        });
    }
};