import { Request, Response } from 'express';
import { Book } from '@/models/Book';
import { AuditLog } from '@/models/AuditLog';
import { Types } from 'mongoose';
import logger from '@/lib/winston';

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.id;

        if (!Types.ObjectId.isValid(bookId)) {
            logger.warn('Invalid book ID provided for deletion:', { bookId });
             res.status(400).json({ 
                success: false, 
                code: 'InvalidId',
                message: 'Invalid book ID' 
            });
            return;
        }

        const book = await Book.findByIdAndDelete(bookId);

        if (!book) {
            logger.warn('Book not found for deletion:', { bookId });
             res.status(404).json({ 
                success: false, 
                code: 'NotFound',
                message: 'Book not found' 
            });
            return;
        }

        await new AuditLog({
            action: 'DELETE_BOOK',
            performedBy: req.user?.userId,
            targetId: book._id,
            targetType: 'Book',
            details: `Deleted book: ${book.title}`
        }).save();

        logger.info('Book deleted successfully:', { bookId: book._id, title: book.title });
        res.status(200).json({ success: true, data: book });
    } catch (error: any) {
        logger.error('Error deleting book:', { 
            error: error.message,
            bookId: req.params.id 
        });
        res.status(500).json({ 
            success: false, 
            code: 'DatabaseError',
            message: 'Error deleting book', 
            error: error.message 
        });
    }
};
