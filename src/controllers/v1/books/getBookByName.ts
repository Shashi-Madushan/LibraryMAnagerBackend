import { Request, Response } from 'express';
import { Book } from '@/models/Book';
import logger from '@/lib/winston';
export const getBooksByName = async (req: Request, res: Response) => {
    try {
        const bookName = req.params.name;
        if (!bookName) {
            logger.warn('Book name not provided');
             res.status(400).json({
                success: false,
                code: 'InvalidInput',
                message: 'Book name is required'
            });
            return;
        }

        const books = await Book.find({ title: new RegExp(bookName, 'i') });

        if(books.length === 0) {
            logger.warn('No books found with the provided name:', { bookName });
             res.status(404).json({
                success: false,
                code: 'NotFound',
                message: 'No books found with the provided name'
            });
            return;
        }
        logger.info('Books fetched successfully by name:', { bookName });

        res.status(200).json({ success: true, data: books });
       
    } catch (error: any) {
        logger.error('Error fetching books by name:', { error: error.message, bookName: req.params.name });
        res.status(500).json({
            success: false,
            code: 'DatabaseError',
            message: 'Error fetching books by name',
            error: error.message
        });
    }
}