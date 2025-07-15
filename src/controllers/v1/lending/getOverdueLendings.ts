import { Request, Response } from 'express';
import { Lending } from '@/models/Lending';
import logger from '@/lib/winston';

export const getOverdueLendings = async (_req: Request, res: Response) => {
  logger.info('Fetching overdue lendings');

  try {
    const overdueLendings = await Lending.find({
      isReturned: false,
      dueDate: { $lt: new Date() }
    })
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .sort({ dueDate: 1 });

    logger.info('Successfully fetched overdue lendings', { 
      count: overdueLendings.length
    });

    res.status(200).json({
      success: true,
      count: overdueLendings.length,
      data: overdueLendings
    });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to fetch overdue lendings', { 
      error: err.message
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue lendings',
      error: err.message
    });
  }
};
