import { Request, Response } from 'express';
import { Book } from '@/models/Book';
import { AuditLog } from '@/models/AuditLog';
import { Types } from 'mongoose';
import logger from '@/lib/winston';
import config from '@/config';
import fs from 'fs';
import path from 'path';

export const deleteBook = async (req: Request, res: Response) => {
    try {
        const bookId = req.params.id;

        if (!Types.ObjectId.isValid(bookId)) {
            logger.warn('Invalid book ID provided for deletion:', { bookId });
            return res.status(400).json({ 
                success: false, 
                code: 'InvalidId',
                message: 'Invalid book ID' 
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            logger.warn('Book not found for deletion:', { bookId });
            return res.status(404).json({ 
                success: false, 
                code: 'NotFound',
                message: 'Book not found' 
            });
        }

        // Store book details before deletion
        const bookDetails = {
            _id: book._id,
            title: book.title
        };

        // Delete the image if it exists
        if (book.imageUrl) {
            const imagePath = book.imageUrl.replace(`${config.APP_URL}/uploads/books/`, '');
            const fullPath = path.join(__dirname, '../../../../public/uploads/books', imagePath);
            
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        // Delete the book from database
        await book.deleteOne();

        // Create audit log
        await new AuditLog({
            action: 'DELETE_BOOK',
            performedBy: req.user?.userId,
            targetId: bookDetails._id,
            targetType: 'Book',
            details: `Deleted book: ${bookDetails.title}`
        }).save();

        logger.info('Book deleted successfully:', { bookId: bookDetails._id, title: bookDetails.title });
        return res.status(200).json({ success: true, data: bookDetails });

    } catch (error: any) {
        logger.error('Error deleting book:', {
            error: error.message,
            bookId: req.params.id
        });
        
        return res.status(500).json({
            success: false,
            code: 'InternalError',
            message: 'An error occurred while deleting the book'
        });
    }
};
      