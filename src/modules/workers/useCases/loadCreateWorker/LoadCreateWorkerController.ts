import { Request, Response } from "express";


class LoadCreateWorkerController{

    handle(req: Request, res: Response ): any {
        
        
        
        return res.render("views/workers/create-worker", {ngos: req.ngos, username: req.user.name, error: req.error, success: req.success})
        


    }
}

export {LoadCreateWorkerController}