import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateWorkerUseCase } from "./CreateWorkerUseCase";



class CreateWorkerController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { name } = req.body

        const createWorkerUseCase = container.resolve(CreateWorkerUseCase)

        await createWorkerUseCase.execute(name)


        return res.status(201).send()
    }


}

export { CreateWorkerController }