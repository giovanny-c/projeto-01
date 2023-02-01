import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateWorkerUseCase } from "./UpdateWorkerUseCase";



class UpdateWorkerController {

    async handle(req: Request, res: Response): Promise<any> {

        const { worker_name: name } = req.body
        const { worker_id: id } = req.params

        const updateWorkerUseCase = container.resolve(UpdateWorkerUseCase)

        await updateWorkerUseCase.execute(id, name)


        return res.status(201).redirect(`/funcionarios/${id}`)
    }


}

export { UpdateWorkerController }