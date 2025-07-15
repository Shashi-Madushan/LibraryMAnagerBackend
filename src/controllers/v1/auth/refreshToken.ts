/**
 * Node modules
 */

import { JsonWebTokenError,TokenExpiredError } from "jsonwebtoken";
/**
 * Custome modules
 */
import logger from "@/lib/winston"; 
import { verifyRefreshToken ,generateAccessToken } from "@/lib/jwt";


/**
 * Models
 */
import token from "@/models/token";
/**
 * Types
 */
import { Request, Response } from "express";
import { Types } from "mongoose";



const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string;
 
    try {
        if (!refreshToken) {
            res.status(401).json({ 
                code: 'AuthorizationError',
                message: 'Refresh token is required' 
            });
            return;
        }

        const tokenExists = await token.exists({ token: refreshToken });

        if (!tokenExists) {
            res.status(403).json({ 
                code: 'AuthorizationError',
                message: 'Invalid refresh token' 
            });
            return;
        }
        
        const jwtPaylode = await verifyRefreshToken(refreshToken) as { userId: Types.ObjectId, role: string };
        const accessToken = await generateAccessToken(jwtPaylode.userId, jwtPaylode.role);
        res.status(200).json({
           accessToken
        });
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            res.status(403).json({ 
                code: 'AuthorizationError',
                message: 'Refresh token has expired pleas log in  again ' 
            });
        } else if (error instanceof JsonWebTokenError) {
            res.status(403).json({ 
                code: 'AuthorizationError',
                message: 'Invalid refresh token' 
            });
        } else {
            logger.error('Error in refreshToken controller:', error);
            res.status(500).json({ 
                code: 'InternalServerError',
                message: 'Internal server error' 
            });
        }
    }
}

export default refreshToken;