import { Request, Response, NextFunction } from 'express';


export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                code: 'AuthenticationError',
                message: 'User not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                code: 'AuthorizationError',
                message: 'You do not have permission to access this resource'
            });
        }

        next();
    };
};
