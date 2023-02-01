import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateWorkerUseCase } from "./CreateWorkerUseCase";



class CreateWorkerController {

    async handle(req: Request, res: Response): Promise<any> {

        const { worker_name: name } = req.body

        const createWorkerUseCase = container.resolve(CreateWorkerUseCase)

        await createWorkerUseCase.execute(name)


        return res.status(201).redirect("/funcionarios")
    }


}

export { CreateWorkerController }