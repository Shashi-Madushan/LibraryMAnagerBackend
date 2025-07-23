import { Router } from 'express';
import { getAuditLogs } from '@/controllers/v1/audit/getAuditLogs';
import { authenticateToken } from '@/middlewares/jwt/authenticateToken';
import { authorizeRoles } from '@/middlewares/jwt/authorizeRoles';

const router = Router();

// Route to get audit logs with date range filter
// Only admin users can access audit logs
router.get(
    '/logs',
    authenticateToken,
    authorizeRoles(('admin')),
    getAuditLogs
);

export default router;
