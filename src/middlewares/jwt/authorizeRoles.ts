import { Request, Response, NextFunction } from 'express';


export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
             res.status(401).json({
                code: 'AuthenticationError',
                message: 'User not authenticated'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
             res.status(403).json({
                code: 'AuthorizationError',
                message: 'You do not have permission to access this resource'
            });
            return;
        }

        next();
    };
};
