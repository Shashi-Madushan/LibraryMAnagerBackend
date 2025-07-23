import { Request, Response } from 'express';
import { AuditLog } from '@/models/AuditLog';

export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const { range } = req.query;
        const now = new Date();

        let startDate: Date;
        switch (range) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            default:
                 res.status(400).json({
                    status: 'error',
                    message: 'Invalid range parameter. Use "today", "week", or "month"'
                });
                return;
        }

        const logs = await AuditLog.find({
            timestamp: {
                $gte: startDate,
                $lte: new Date()
            }
        })
        .sort({ timestamp: -1 })
        .populate('performedBy', 'username email')
        .exec();

         res.status(200).json({
            status: 'success',
            data: logs
        });
        return;

    } catch (error) {
        console.error('Error fetching audit logs:', error);
         res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
        return;
    }
};
