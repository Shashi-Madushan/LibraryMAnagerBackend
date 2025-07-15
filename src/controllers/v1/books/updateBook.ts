import { Request, Response } from 'express';
import { Book } from '@/models/Book';
import { AuditLog } from '@/models/AuditLog';
import { Types } from 'mongoose';
import logger from '@/lib/winston';

export const updateBook = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.id;
        
        if (!Types.ObjectId.isValid(bookId)) {
            logger.warn('Invalid book ID provided for update:', { bookId });
             res.status(400).json({ 
                success: false, 
                code: 'InvalidId',
                message: 'Invalid book ID' 
            });
            return;
        }

        const book = await Book.findByIdAndUpdate(
            bookId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!book) {
            logger.warn('Book not found for update:', { bookId });
             res.status(404).json({ 
                success: false, 
                code: 'NotFound',
                message: 'Book not found' 
            });
            return;
        }

        await new AuditLog({
            action: 'UPDATE_BOOK',
            performedBy: req.user?.userId,
            targetId: book._id,
            targetType: 'Book',
            details: `Updated book: ${book.title}`
        }).save();

        logger.info('Book updated successfully:', { bookId: book._id, title: book.title });
        res.status(200).json({ success: true, data: book });
    } catch (error: any) {
        logger.error('Error updating book:', { 
            error: error.message,
            bookId: req.params.id,
            updateData: req.body 
        });

        if (error.name === 'ValidationError') {
            res.status(400).json({ 
                success: false, 
                code: 'ValidationError',
                message: 'Invalid update data', 
                errors: Object.values(error.errors).map((err: any) => err.message)
            });
        } else {
            res.status(500).json({ 
                success: false, 
                code: 'DatabaseError',
                message: 'Error updating book', 
                error: error.message 
            });
        }
    }
};
