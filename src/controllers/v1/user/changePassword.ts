import { Request, Response } from 'express';
import { User } from '@/models/User';
import logger from '@/lib/winston';
import bcrypt from 'bcrypt';

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user?.userId);

        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found'
            });
        } else {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                res.status(401).json({
                    code: 'AuthenticationError',
                    message: 'Current password is incorrect'
                });
            } else {
                user.password = newPassword;
                await user.save();
                res.status(200).json({
                    message: 'Password changed successfully'
                });
            }
        }
    } catch (error) {
        logger.error('Error changing password:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error changing password'
        });
    }
};