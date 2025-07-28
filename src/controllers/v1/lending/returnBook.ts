import { Request, Response } from 'express';
import { Lending } from '@/models/Lending';
import { Book } from '@/models/Book';
import logger from '@/lib/winston';
import { AuditLog } from '@/models/AuditLog';

export const returnBook = async (req: Request, res: Response) => {
  const { lendingId } = req.params;

  logger.info('Attempting to return book', { lendingId });

  try {
    const lending = await Lending.findById(lendingId);
    if (!lending) {
      logger.warn('Lending record not found', { lendingId });
      res.status(404).json({ message: 'Lending record not found' });
      return;
    }

    if (lending.isReturned) {
      logger.warn('Book already returned', { lendingId });
      res.status(400).json({ message: 'Book already returned' });
      return;
    }

    // Update return information
    lending.isReturned = true;
    lending.returnedAt = new Date();
    await lending.save();

    // Make book available again
    await Book.findByIdAndUpdate(lending.bookId, { available: true });

    // Populate user and book details
    await lending.populate([
      { path: 'userId', select: 'name email' },
      { path: 'bookId', select: 'title author' }
    ]);

    // Add audit log for return action
    await AuditLog.create({
      action: 'RETURN',
      performedBy: req.user?.userId,
      targetId: lending._id,
      targetType: 'Lending',
      details: `Book '${lending.bookId}' returned by user '${lending.userId}'`,
      timestamp: new Date()
    });

    logger.info('Book returned successfully', {
      lendingId,
      bookId: lending.bookId,
      userId: lending.userId,
      returnedAt: lending.returnedAt
    });

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: lending
    });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to return book', {
      error: err.message,
      lendingId
    });

    res.status(500).json({
      success: false,
      message: 'Failed to return book',
      error: err.message
    });
  }
};
