import { Request, Response } from "express";



class LoadLoginPageController {
 


    async handle(req: Request, res: Response): Promise<any>{
        
        //criar um validator de erro de session
        let error

        if(req.session.error){
            error = req.session.error
            req.session.error = undefined
        }

        return res.render("views/session/login", {error})
    }
}

export {LoadLoginPageController}