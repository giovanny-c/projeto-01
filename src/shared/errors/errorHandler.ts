import { NextFunction, Request, Response } from "express"
import { AppError } from "./AppError"


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        console.error(err)
        return res.status(err.statusCode).json({ message: err.message })
    }
    
    console.error(err)
    return res.status(500).json({
        
        status: "error",
        message: `Internal server error - ${err.message}`
    })
}