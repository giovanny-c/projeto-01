import { Request, Response } from "express";



class LoadLoginPageController {
 


    async handle(req: Request, res: Response): Promise<any>{
        
        //criar um validator de erro de session
        

        return res.render("views/session/login")
    }
}

export {LoadLoginPageController}