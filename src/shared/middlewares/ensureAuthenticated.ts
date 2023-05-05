import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { getExecutionTime } from "../../../utils/decorators/executionTime";
import { DayjsDateProvider } from "../container/providers/dateProvider/implementations/DayjsDateProvider";
import { AppError } from "../errors/AppError";





export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    console.log(req.socket.remoteAddress)
    // console.log(`${req.ip}--${req.ips}`)
    
    if (!req.session || !req.session.user) {

        req.session.error = {
            message: "Sessão expirada, por favor entre de novo.",
            status: 401
        }
        return res.redirect("/entrar")



    }

    
   
    const dateProvider = container.resolve(DayjsDateProvider)
    // 
    let [amount, time_unit] = String(process.env.ABSOLUTE_SESSION_TIME_OUT).split(" ")
    
    //data maxima que a sessao pode existir = data de criação + tempo absoluto
    const absoluteSessionTimeOut = dateProvider.addOrSubtractTime("add", time_unit, Number(amount), req.session.created_at)
    
    // console.log(`1 vez - ${absoluteSessionTimeOut}`)
    //para nao permitir que e sessao seja prolongada indefinidamente
    if(!dateProvider.compareIfBefore(dateProvider.dateNow(), absoluteSessionTimeOut)){
        req.session.error = {
            message: "Sessão expirada, por favor entre de novo.",
            status: 401
        }
        return res.redirect("/entrar")

    }

    // console.log(req.sessionID)

    req.user = {

        id: req.session.user.id,
        admin: req.session.user.admin,

    }



    next()


}