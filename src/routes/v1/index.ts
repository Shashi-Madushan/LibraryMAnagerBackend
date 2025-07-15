/**
 *  Node modeules 
 */

import { Router } from "express";

/**
 * Midelware
 */
import { authenticateToken } from "@/middlewares/authenticateToken";

/**
 *  Routes
 */

import authRoutes from "@/routes/v1/authRoutes";


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

 //app.use(asyncHandler(authenticateToken));

rootRouter.use('/auth', authRoutes);

export default rootRouter;