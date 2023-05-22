import { NextFunction, Request, Response } from "express";




export async function ensureAdmin(req: Request, res: Response, next: NextFunction) {

   
   if(!req.session.user.admin || !req.user.admin ){

        let back 
        
        !req.headers.referer? back = "back" : back = req.headers.referer
        
        req.session.error = {
            message: "Apenas administradores podem acessar esse conteudo",
            status: 401
        }

        return res.redirect(back)

   }


    next()


}