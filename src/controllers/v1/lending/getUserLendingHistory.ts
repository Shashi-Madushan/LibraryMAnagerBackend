import { Request, Response } from 'express';
import { Lending } from '@/models/Lending';
import logger from '@/lib/winston';

export const getUserLendingHistory = async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  logger.info('Fetching user lending history', { userId });

  try {
    const lendings = await Lending.find({ userId })
      .populate('bookId', 'title author')
      .sort({ borrowedAt: -1 });

    logger.info('Successfully fetched user lending history', { 
      userId,
      count: lendings.length
    });

    res.status(200).json({
      success: true,
      count: lendings.length,
      data: lendings
    });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to fetch user lending history', { 
      error: err.message,
      userId
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user lending history',
      error: err.message
    });
  }
};
