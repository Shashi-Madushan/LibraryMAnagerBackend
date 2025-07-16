import { Request, Response } from 'express';
import { User } from '@/models/User';
import { sendEmail, generateReminderEmailContent } from '@/utils/emailService';
import logger from '@/lib/winston';

interface BookReminderData {
    title: string;
    dueDate: Date;
}

interface ReminderRequestBody {
    userId: string;
    books: BookReminderData[];
}

export const sendReminderEmail = async (req: Request, res: Response) => {
    try {
        const { userId, books } = req.body as ReminderRequestBody;
        logger.info('Received reminder email request', { userId, bookCount: books.length });

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            logger.warn('User not found for reminder email', { userId });
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate and send email
        const emailContent = generateReminderEmailContent(user.firstName ?? '', books);
        const emailSent = await sendEmail({
            to: user.email,
            subject: 'Library Book Return Reminder',
            html: emailContent
        });

        if (emailSent) {
            logger.info('Reminder email sent successfully', { 
                userId,
                email: user.email,
                bookCount: books.length
            });
            return res.status(200).json({ message: 'Reminder email sent successfully' });
        } else {
            logger.error('Failed to send reminder email', { 
                userId,
                email: user.email
            });
            return res.status(500).json({ message: 'Failed to send reminder email' });
        }
    } catch (error) {
        logger.error('Error in sendReminderEmail', {
            error: error instanceof Error ? error.message : 'Unknown error',
            userId: req.body.userId,
            stack: error instanceof Error ? error.stack : undefined
        });
        return res.status(500).json({ message: 'Internal server error' });
    }
};