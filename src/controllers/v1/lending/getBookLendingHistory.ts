import { Request, Response } from 'express';
import { Lending } from '@/models/Lending';
import logger from '@/lib/winston';

export const getBookLendingHistory = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  
  logger.info('Fetching book lending history', { bookId });

  try {
    const lendings = await Lending.find({ bookId })
      .populate('userId', 'name email')
      .sort({ borrowedAt: -1 });

    logger.info('Successfully fetched book lending history', { 
      bookId,
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
      bookId
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch book lending history',
      error: err.message
    });
  }
};
