import { Request, Response } from 'express';
import { Book } from '@/models/Book';
import logger from '@/lib/winston';

export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const books = await Book.find();
        logger.info('Successfully fetched all books');
        res.status(200).json({ success: true, data: books });
    } catch (error: any) {
        logger.error('Error fetching books:', { error: error.message });
        res.status(500).json({ 
            success: false, 
            code: 'DatabaseError',
            message: 'Error fetching books', 
            error: error.message 
        });
    }
};
