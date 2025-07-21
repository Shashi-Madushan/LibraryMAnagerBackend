import logger from '@/lib/winston';
import { generateRandomUsername } from '@/utils';
import { User } from '@/models/User';
import config from '@/config';
import type { IUser } from '@/models/User';
import { Request, Response } from 'express';

type UserData = Pick<IUser, 'email' | 'password' | 'role' | 'firstName' | 'lastName'>;

// Create user function
const createUser = async (userData: UserData): Promise<IUser> => {
    const { email, password, role, firstName, lastName } = userData;

    // Check if attempting admin registration
    if(role === 'admin' && !config.WHITELIST_ADMIN_MAILS.includes(email)){
        logger.warn(
            `User with email ${email} tried to register as an admin but is not in the whitelist`
        );
        throw new Error('Unauthorized admin registration attempt');
    }

    // Generate random username
    const username = generateRandomUsername();

    // Create new user
    const newUser = await User.create({
        username,
        email,
        password,
        role: role || 'user', // Default to 'user' if no role is provided
        firstName: firstName,
        lastName: lastName,
    });

    logger.info(`New user created: ${newUser.username} (${newUser.email})`);

    return newUser;
}

// HTTP request handler
const addUser = async (req: Request, res: Response) => {
    try {
        const userData: UserData = req.body;
        const newUser = await createUser(userData);
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error: any) {
        logger.error(`Error creating user: ${error.message}`);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export default addUser;