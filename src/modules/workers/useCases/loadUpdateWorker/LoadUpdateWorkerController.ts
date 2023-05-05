import { Request, Response } from "express";
import { container } from "tsyringe";
import { LoadUpdateWorkerUseCase } from "./LoadUpdateWorkerUseCase";




class LoadUpdateWorkerController {

    async handle(req: Request, res: Response): Promise<any> {

        
        const { worker_id } = req.params

        const loadUpdateWorkerUseCase = container.resolve(LoadUpdateWorkerUseCase)

        const worker = await loadUpdateWorkerUseCase.execute(worker_id)


        return res.status(201).render("views/workers/create-worker", {worker, username: req.user.name, error: req.error, success: req.success})
    }


}

export { LoadUpdateWorkerController }