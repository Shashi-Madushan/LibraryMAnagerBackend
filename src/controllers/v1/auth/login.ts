/**
 * Custome modules 
 */

import { generateAccessToken ,generateRefreshToken } from "@/lib/jwt";
import logger  from "@/lib/winston";
import config from "@/config";


/**
 * Modells 
 */
import { User } from "@/models/User";
import token from "@/models/token";


/**
 * Types
 */
import type { Request,Response } from "express";
import type { IUser } from "@/models/User";

type userData = Pick<IUser,'email' | 'password' >


const login = async (req: Request,res :Response) :Promise<void>=>{
     try{

        const{ email, password } = req.body as userData

        // Validate required fields
        if (!email || !password) {
            res.status(400).json({
                code: 'BadRequest',
                message: 'Email and password are required'
            });
            return;
        }

        const user = await User.findOne({email})
        if(!user){
            res.status(404).json({
                code: 'NotFound',
                message: ' User not found '
            });
            return;
        }

        // Verify password (assuming you have a method to compare passwords)
        // const isPasswordValid = await user.comparePassword(password);
        // if (!isPasswordValid) {
        //     res.status(401).json({
        //         code: 'Unauthorized',
        //         message: 'Invalid credentials'
        //     });
        //     return;
        // }

        // generate a JWT accses token and refresh token for the new user
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        // store refresh token in data base 

        await token.create({token: refreshToken,userId: user._id});

        logger.info('Refresh token created for user ',{
            userId: user._id
        });


        res.cookie('refreshToken', refreshToken,{
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: config.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        })


        res.status(201).json({
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
            },
            accessToken,
        });
        logger.info(` User loged in : ${user.username} (${user.email})`);
    }catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            status: "error",
            serverTime: new Date().toISOString(),
        });
        logger.error("Error in register user:", error);
    }
}

export default login;