import { container } from "tsyringe"
import { Request, Response } from "express"
import { GetWorkerUseCase } from "./GetWorkerUseCase"

class GetWorkerController {

    async handle(req: Request, res: Response): Promise<any> {

        const { worker_id } = req.params


        const getWorker = container.resolve(GetWorkerUseCase)

        const {worker} = await getWorker.execute({worker_id})
           

        return res.status(200).render("views/workers/worker", {ngos: req.ngos, worker, username: req.user.name, error: req.error, success: req.success})
    }
}

export { GetWorkerController }