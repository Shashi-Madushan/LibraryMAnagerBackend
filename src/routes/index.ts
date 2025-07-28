/**
 *  Node modeules 
 */

import { Router } from "express";

/**
 * Midelware
 */
import { authenticateToken } from "@/middlewares/jwt/authenticateToken";
import { authorizeRoles } from "@/middlewares/jwt/authorizeRoles";

/**
 *  Routes
 */

import authRouter from "@/routes/v1/authRoutes";
import userRouter from "@/routes/v1/userRoutes";
import bookRouter from "@/routes/v1/bookRoutes";
import lendingRouter from "@/routes/v1/lendingRoutes";
import auditRouter from "@/routes/v1/auditRoutes";
import emailRouter from "@/routes/v1/emailRoutes";
import dasbordRouter from "@/routes/v1/dashboardRoutes"


const rootRouter = Router();

rootRouter.get('/', (req, res) => {
    res.status(200).json({
        message: " API is running successfully",
        status: "success",
        version :'1.0.0',
        serverTime: new Date().toISOString(),
    })
})

// Helper to wrap async middleware for Express error handling
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


rootRouter.use('/auth', authRouter);

rootRouter.use('/user', asyncHandler(authenticateToken), userRouter);
rootRouter.use('/books', asyncHandler(authenticateToken), bookRouter);
rootRouter.use('/lendings', asyncHandler(authenticateToken), lendingRouter);
rootRouter.use('/email', asyncHandler(authenticateToken), emailRouter);
rootRouter.use('/audit', asyncHandler(authenticateToken), auditRouter);
rootRouter.use('/dashbord',asyncHandler(authenticateToken),dasbordRouter)

export default rootRouter;