import { Request, Response } from 'express';
import { Lending } from '@/models/Lending';
import { Book } from '@/models/Book';
import logger from '@/lib/winston';
import { AuditLog } from '@/models/AuditLog';



export const lendBook = async (req: Request, res: Response) => {
  logger.info('Attempting to lend book', { userId: req.body.userId, bookId: req.body.bookId });

  const { userId, bookId } = req.body;
  const LENDING_PERIOD_DAYS = 14; // Fixed lending period of 14 days

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      logger.warn('Book not found for lending', { bookId });
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    if (!book.available) {
      logger.warn('Book not available for lending', { bookId });
      res.status(400).json({ message: 'Book is not available for lending' });

      return;
    }

    // Calculate due date correctly
    const borrowedAt = new Date();
    const dueDate = new Date(borrowedAt.getTime() + LENDING_PERIOD_DAYS * 24 * 60 * 60 * 1000);

    // Create lending record
    const lending = await Lending.create({
      userId,
      bookId,
      borrowedAt,
      dueDate,
      isReturned: false,
    });

    // Mark book as unavailable
    book.available = false;
    await book.save();

    // Populate user and book details
    await lending.populate([
      { path: 'userId', select: 'name email' },
      { path: 'bookId', select: 'title author' }
    ]);

    // Add audit log for lending action
    await AuditLog.create({
      action: 'LEND',
      performedBy: req.user?.userId,
      targetId: lending._id,
      targetType: 'Lending',
      details: `Book '${book.title}' lent to user '${lending.userId}'`,
      timestamp: new Date()
    });

    logger.info('Book lent successfully', {
      lendingId: lending._id,
      userId,
      bookId,
      dueDate
    });

    res.status(201).json({
      success: true,
      message: 'Book lent successfully',
      data: lending
    });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to lend book', {
      error: err.message,
      userId,
      bookId
    });

    res.status(500).json({
      success: false,
      message: 'Failed to lend book',
      error: err.message
    });
  }
};
