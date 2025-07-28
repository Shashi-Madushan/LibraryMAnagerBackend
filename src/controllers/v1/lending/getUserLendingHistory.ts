import { Request, Response } from 'express';
import { Lending } from '@/models/Lending';
import { User } from '@/models/User'; // import User model
import logger from '@/lib/winston';

export const getUserLendingHistory = async (req: Request, res: Response) => {
  const { email } = req.params;
  console.log('Fetching lending history for user:', email);

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('User not found for lending history', { email });
       res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    logger.info('Fetching user lending history', { userId: user._id });

    // Find lendings by userId
    const lendings = await Lending.find({ userId: user._id })
      .populate('bookId', 'title author')
      .sort({ borrowedAt: -1 });

    logger.info('Successfully fetched user lending history', { 
      userId: user._id,
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
      email
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user lending history',
      error: err.message
    });
  }
};
