import { Request, Response, NextFunction } from 'express';
import { User } from '@/models/User';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?.userId);
        if (user?.role !== 'admin') {
            return res.status(403).json({
                code: 'Forbidden',
                message: 'Admin access required'
            });
        }
        next();
    } catch (error) {
        res.status(500).json({
            code: 'InternalServerError',
            message: 'Error checking admin permissions'
        });
    }
};
