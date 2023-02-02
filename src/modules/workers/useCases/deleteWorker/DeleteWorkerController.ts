import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteWorkerUseCase } from "./DeleteWorkerUseCase";




class DeleteWorkerController {

    async handle(req: Request, res: Response): Promise<any> {

        
        const { worker_id: id } = req.params

        const deleteWorkerUseCase = container.resolve(DeleteWorkerUseCase)

        await deleteWorkerUseCase.execute(id)


        return res.status(201).redirect(`/funcionarios`)
    }


}

export { DeleteWorkerController }