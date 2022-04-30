import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateWorkerUseCase } from "./UpdateWorkerUseCase";



class UpdateWorkerController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { name } = req.body
        const { id } = req.params

        const updateWorkerUseCase = container.resolve(UpdateWorkerUseCase)

        await updateWorkerUseCase.execute(id, name)


        return res.status(201).send()
    }


}

export { UpdateWorkerController }