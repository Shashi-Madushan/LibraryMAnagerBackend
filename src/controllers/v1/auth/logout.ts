/**
 * Node modules 
 */
import { Request, Response } from 'express';
/**
 * custome modules
 */
import Token from '@/models/token';
import logger from '@/lib/winston';

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (refreshToken) {
            // Remove refresh token from database
            await Token.deleteOne({ token: refreshToken });
            
            // Clear the refresh token cookie
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }

        res.status(200).json({
            message: 'Logged out successfully'
        });
        
        logger.info('User logged out successfully');
    } catch (error) {
        logger.error('Error in logout:', error);
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error logging out'
        });
    }
};

export default logout;
