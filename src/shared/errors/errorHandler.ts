import { NextFunction, Request, Response } from "express"
import { AppError } from "./AppError"


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
   
    if (err instanceof AppError) {

        

        req.session.error = {
            message: err.message,
            status: err.statusCode
        }
        
        return res.redirect("back")


    }
    

    console.error(err)

    req.session.error = {
        message: `Internal server error - ${err.message}`,
        status: 500
    }

    return res.redirect("back")
}