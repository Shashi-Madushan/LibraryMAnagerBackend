import { Request, Response } from 'express';
import { User } from '@/models/User';
import logger from '@/lib/winston';
import bcrypt from 'bcrypt';
import Token from '@/models/token';

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
       