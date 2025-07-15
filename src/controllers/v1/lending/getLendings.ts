import { Request, Response } from 'express';
import { Lending } from '@/models/Lending';
import logger from '@/lib/winston';


export const getLendings = async (req: Request, res: Response) => {
  logger.info('Fetching lendings with filters', { query: req.query });
  
  try {
    const {
      userId,
      bookId,
      isReturned,
      overdue,
      startDate,
      endDate
    } = req.query;

    const query: any = {};

    // Apply filters
    if (userId) query.userId = userId;
    if (bookId) query.bookId = bookId;
    if (isReturned !== undefined) query.isReturned = isReturned === 'true';
    if (overdue === 'true') {
      query.isReturned = false;
      query.dueDate = { $lt: new Date() };
    }
    if (startDate) query.borrowedAt = { $gte: new Date(startDate as string) };
    if (endDate) {
      query.borrowedAt = {
        ...query.borrowedAt,
        $lte: new Date(endDate as string)
      };
    }

    const lendings = await Lending.find(query)
      .populate('userId', 'name email')
      .populate('bookId', 'title author')
      .sort({ borrowedAt: -1 });

    logger.info('Successfully fetched lendings', { 
      count: lendings.length,
      filters: req.query
    });

    res.status(200).json({
      success: true,
      count: lendings.length,
      data: lendings
    });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to fetch lendings', { 
      error: err.message,
      query: req.query
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lending records',
      error: err.message
    });
  }
};
