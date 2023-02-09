import { NextFunction, Request, Response } from "express";



export  function handleMessage(req: Request, res: Response, next: NextFunction) {



    if(req.session.error){
        
        req.user.error = req.session.error
        
        req.session.error = false

    }

    //nao usado no momento
    if(req.session.success){
        
        req.user.success = req.session.success
        
        req.session.success = false

    }



    next()


}