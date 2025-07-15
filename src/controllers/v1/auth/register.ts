/**
 * coustome module 
 *
 */
import { generateAccessToken , generateRefreshToken } from '@/lib/jwt';
import  logger  from '@/lib/winston';
import config from '@/config';
import { generateRandomUsername } from '@/utils';

/**
 * Models
 */

import { User } from '@/models/User';
import Token from '@/models/token';

/**
 * Types
 */
import type { IUser } from '@/models/User';
import e, { Request, Response } from 'express';  

type UserData = Pick<IUser, 'email' | 'password' | 'role' | 'firstName' | 'lastName'>;


const register = async (req: Request, res: Response) : Promise<void> => {
    
    const { email, password, role, firstName, lastName } = req.body as UserData;

    if(role === 'admin' && !config.WHITELIST_ADMIN_MAILS.includes(email)){
        res.status(403).json({
            code : 'AutherizationError',
            message: 'you cant register as an admin'
        });

        logger.warn(
            `User with email ${email} tried to register as an admin but is not in the whitelist`
        )
        return;
    }

    try{
        const username = generateRandomUsername();

        const newUser = await User.create({
            username,
            email,
            password,
            role: role || 'user', // Default to 'user' if no role is provided
            firstName: firstName ,
            lastName: lastName ,
        })


        // generate a JWT accses token and refresh token for the new user
        const accessToken = generateAccessToken(newUser._id, newUser.role);
        const refreshToken = generateRefreshToken(newUser._id, newUser.role);

        // store refresh token in data base 

        await Token.create({token: refreshToken,userId: newUser._id});

        logger.info('Refresh token created for user ',{
            userId: newUser._id
        });


        res.cookie('refreshToken', refreshToken,{
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: config.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        })


        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                isActive: newUser.isActive,
            },
            accessToken,
        });
        logger.info(`New user registered: ${newUser.username} (${newUser.email})`);
    }catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            status: "error",
            serverTime: new Date().toISOString(),
        });
        logger.error("Error in register user:", error);
    }
}

export default register;