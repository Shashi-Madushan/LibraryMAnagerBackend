import { Request, Response } from 'express';
import { User } from "@/models/User";
import { Book } from "@/models/Book";
import { Lending } from "@/models/Lending";
import logger from '@/lib/winston';

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        logger.info('Fetching dashboard data');

        const totalUsers = await User.countDocuments();
        const totalBooks = await Book.countDocuments();
        const lendedBooks = await Lending.countDocuments({ isReturned: false });
        const delayedBooks = await Lending.countDocuments({
            isReturned: false,
            dueDate: { $lt: new Date() }
        });

        logger.info('Successfully fetched dashboard data', {
            totalUsers,
            totalBooks,
            lendedBooks,
            delayedBooks
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalBooks,
                lendedBooks,
                delayedBooks
            }
        });
    } catch (error) {
        const err = error as Error;
        logger.error('Failed to fetch dashboard data', { error: err.message });

        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: err.message
        });
    }
};
