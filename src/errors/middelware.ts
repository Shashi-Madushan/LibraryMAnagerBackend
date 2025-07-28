import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof mongoose.Error) {
        res.status(400).json({ message: "Database error occurred"})
        return
    }
    res.status(500).json({ message: "An unexpected error occurred" });
}