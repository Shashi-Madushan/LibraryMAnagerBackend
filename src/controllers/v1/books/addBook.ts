import { Request, Response } from 'express';
import { Book } from '@/models/Book';
import { AuditLog } from '@/models/AuditLog';
import logger from '@/lib/winston';
import config from '@/config';

export const addBook = async (req: Request, res: Response) => {
    try {
        const bookData = req.body;
        
        // Add image URL if file was uploaded
        if (req.file) {
            // Generate public URL for the image
            const imageUrl = `${config.APP_URL}/uploads/books/${req.file.filename}`;
            bookData.imageUrl = imageUrl;
        }

        const book = new Book(bookData);
        await book.save();

        await new AuditLog({
            action: 'CREATE_BOOK',
            performedBy: req.user?.userId,
            targetId: book._id,
            targetType: 'Book',
            details: `Created new book: ${book.title}`
        }).save();

        logger.info('New book created:', { bookId: book._id, title: book.title });
        res.status(201).json({ success: true, data: book });
    } catch (error: any) {
        logger.error('Error creating book:', { 
            error: error.message,
            bookData: req.body 
        });
        
        if (error.name === 'ValidationError') {
            res.status(400).json({ 
                success: false, 
                code: 'ValidationError',
                message: 'Invalid book data', 
                errors: Object.values(error.errors).map((err: any) => err.message)
            });
        } else {
            res.status(500).json({ 
                success: false, 
                code: 'DatabaseError',
                message: 'Error creating book', 
                error: error.message 
            });
        }
    }
};
