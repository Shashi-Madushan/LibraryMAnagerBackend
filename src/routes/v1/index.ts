/**
 *  Node modeules 
 */

import { Router } from "express";


/**
 *  Root router for the application
 */

const rootRouter = Router();

/**
 *  Routes
 */

import authRoutes from "@/routes/v1/auth";

/**
 * root route handler
 */
rootRouter.get('/', (req, res) => {
    res.status(200).json({
        message: " API is running successfully",
        status: "success",
        version :'1.0.0',
        serverTime: new Date().toISOString(),
    })
})


rootRouter.use('/auth', authRoutes);

export default rootRouter;