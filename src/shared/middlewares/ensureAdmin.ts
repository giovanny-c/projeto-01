import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { DayjsDateProvider } from "../container/providers/dateProvider/implementations/DayjsDateProvider";
import { AppError } from "../errors/AppError";





export async function ensureAdmin(req: Request, res: Response, next: NextFunction) {

   console.log("admin")
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