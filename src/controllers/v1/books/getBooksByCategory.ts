import { Request, Response } from 'express';
import { Book } from '@/models/Book';
import logger from '@/lib/winston';

export const getBooksByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        const books = await Book.find({ category });

        logger.info('Books fetched by category:', { category, count: books.length });
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error: any) {
        logger.error('Error fetching books by category:', {
            error: error.message,
            category: req.params.category
        });
        res.status(500).json({
            success: false,
            code: 'DatabaseError',
            message: 'Error fetching books by category',
            error: error.message
        });
    }
};
