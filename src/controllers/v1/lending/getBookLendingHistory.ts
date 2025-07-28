import { Request, Response } from 'express';
import { Lending } from '@/models/Lending';
import { Book } from '@/models/Book'; // import Book model
import logger from '@/lib/winston';

export const getBookLendingHistory = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    // Find book by title
    const book = await Book.findOne({ title: name });
    if (!book) {
      logger.warn('Book not found for lending history', { name });
       res.status(404).json({
        success: false,
        message: 'Book not found'
      });
      return;
    }

    logger.info('Fetching book lending history', { bookId: book._id });

    // Find lendings by bookId
    const lendings = await Lending.find({ bookId: book._id })
      .populate('userId', 'name email')
      .sort({ borrowedAt: -1 });

    logger.info('Successfully fetched book lending history', { 
      bookId: book._id,
      count: lendings.length
    });

    res.status(200).json({
      success: true,
      count: lendings.length,
      data: lendings
    });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to fetch book lending history', { 
      error: err.message,
      name
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book lending history',
      error: err.message
    });
  }
};
