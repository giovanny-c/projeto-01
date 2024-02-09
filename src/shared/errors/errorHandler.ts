import { NextFunction, Request, Response } from "express"
import { AppError } from "./AppError"


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    
    if (err instanceof AppError && err.statusCode === 429){
        console.error("Too many Requests")
        return res.status(429).render("views/error", {error: err})
    }

    if (err instanceof AppError) {

        
        console.error(err) 
    
        req.session.error = {
            message: err.message,
            status: err.statusCode,
            stack: err.stack
        }

        let back 

        !req.headers.referer? back = "back" : back = req.headers.referer

        return res.redirect(back)


    }

    
    

    console.error(err)

    req.session.error = {
        message: `Não foi possível processar a soliçitação`,
        status: 500
    }

    let back 

    !req.headers.referer? back = "back" : back = req.headers.referer

  
    return res.redirect(back)
}