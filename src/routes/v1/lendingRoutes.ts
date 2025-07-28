import { Router } from 'express';
import {
    lendBook,
    returnBook,
    getLendings,
    getUserLendingHistory,
    getBookLendingHistory,
    getOverdueLendings
} from '@/controllers/v1/lending';
import { authenticateToken } from '@/middlewares/jwt/authenticateToken';
import { authorizeRoles } from '@/middlewares/jwt/authorizeRoles';

const router = Router();

// Base routes for all users (must be authenticated)
router.use(authenticateToken as any);

// Public routes (for authenticated users)
router.get('/user/:email', getUserLendingHistory);

// Protected routes (librarian only)
router.use(authorizeRoles('admin') as any);
router.post('/lend', lendBook);
router.put('/return/:lendingId', returnBook);
router.get('/', getLendings);
router.get('/book/:name', getBookLendingHistory);
router.get('/overdue', getOverdueLendings);

export default router;
