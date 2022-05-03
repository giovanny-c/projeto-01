import { container } from "tsyringe"
import { Request, Response } from "express"
import { WorkerContribuitionsUseCase } from "./WorkerContribuitionsUseCase"

class WorkerContirbuitionsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { orderBy, limit, offset, startDate, endDate } = req.query
        const { id } = req.params


        const workerContirbuitionsUseCase = container.resolve(WorkerContribuitionsUseCase)

        const results = await workerContirbuitionsUseCase.execute(
            id as string,
            {
                orderBy: orderBy as string,
                limit: limit as any,
                offset: offset as any,
                startDate: startDate as string,
                endDate: endDate as string
            })

        return res.json(results)
    }
}

export { WorkerContirbuitionsController }