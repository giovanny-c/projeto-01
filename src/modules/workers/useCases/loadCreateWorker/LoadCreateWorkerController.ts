import { Request, Response } from "express";


class LoadCreateWorkerController{

    handle(req: Request, res: Response ): any {
        
        
        
        return res.render("views/workers/create-worker")
        


    }
}

export {LoadCreateWorkerController}