import { Request, Response } from 'express';
import { Book } from '@/models/Book';
import { Types } from 'mongoose';
import logger from '@/lib/winston';

export const getBookById = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.id;

        if (!Types.ObjectId.isValid(bookId)) {
            logger.warn('Invalid book ID provided:', { bookId });
             res.status(400).json({
                success: false,
                code: 'InvalidId',
                message: 'Invalid book ID format'
            });
            return;
        }

        const book = await Book.findById(bookId);

        if (!book) {
            logger.warn('Book not found:', { bookId });
             res.status(404).json({
                success: false,
                code: 'NotFound',
                message: 'Book not found'
            });
            return;
        }

        logger.info('Book fetched successfully:', { bookId: book._id, title: book.title });
        res.status(200).json({ success: true, data: book });
    } catch (error: any) {
        logger.error('Error fetching book:', { error: error.message, bookId: req.params.id });
        res.status(500).json({
            success: false,
            code: 'DatabaseError',
            message: 'Error fetching book',
            error: error.message
        });
    }
};
