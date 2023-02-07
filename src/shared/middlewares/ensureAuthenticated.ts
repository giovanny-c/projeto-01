import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { DayjsDateProvider } from "../container/providers/dateProvider/implementations/DayjsDateProvider";
import { AppError } from "../errors/AppError";





export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

   
    if (!req.session || !req.session.user) {
        throw new AppError("Session expired please log-in again", 401)


    }

    //funciona o constructor com inject() ?????????????
    const dateProvider = container.resolve(DayjsDateProvider)

    
    // 
    let [amount, time_unit] = String(process.env.ABSOLUTE_SESSION_TIME_OUT).split(" ")
    
    const absoluteSessionTimeOut = dateProvider.addOrSubtractTime("add", time_unit, Number(amount), req.session.created_at)
    
    console.log(absoluteSessionTimeOut)
    //para nao permitir que e sessao seja prolongada indefinidamente
    if(req.session.ttl && !dateProvider.compareIfBefore(dateProvider.dateNow(), absoluteSessionTimeOut)){
        
        throw new AppError("Session expired please log-in again", 401)
    }

    req.user = {

        id: req.session.user.id,
        admin: req.session.user.admin,

    }



    next()


}