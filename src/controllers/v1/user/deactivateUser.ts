import { Request, Response } from 'express';
import { User } from '@/models/User';
import { AuditLog } from '@/models/AuditLog';
import logger from '@/lib/winston';

export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    // Create audit log
    await AuditLog.create({
      action: 'UPDATE_USER',
      performedBy: req.user?.userId,
      targetId: user._id,
      targetType: 'User',
      details: `Deactivated user ${user.username}`
    });

    res.status(200).json({
      message: 'User deactivated successfully',
      user,
    });
  } catch (error: any) {
    logger.error('Error deactivating user:', error.message || error);
    res.status(500).json({
      code: 'InternalServerError',
      message: 'Error deactivating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
