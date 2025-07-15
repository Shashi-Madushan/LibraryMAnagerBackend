/**
 * Node modules
 */


import jwt from 'jsonwebtoken';

/**
 *  Custome modules
 */

import config from '@/config/index';


/**
 *  Types
 */

import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId, role: string): string => {
    return jwt.sign({ userId, role }, config.JWT_ACCESS_TOKEN_SECRET as string, {
        expiresIn: config.JWT_ACCESS_TOKEN_EXPIRATION,
        subject: 'accessToken',
    });
};

export const generateRefreshToken = (userId: Types.ObjectId, role: string): string => {
    return jwt.sign({ userId, role }, config.JWT_REFRESH_TOKEN_SECRET as string, {
        expiresIn: config.JWT_REFRESH_TOKEN_EXPIRATION,
        subject: 'refreshToken',
    });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET as string);
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, config.JWT_REFRESH_TOKEN_SECRET as string); }