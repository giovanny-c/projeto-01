import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListWorkersUseCase } from "./ListWorkersUseCase";



class ListWorkersController {

    async handle(req: Request, res: Response): Promise<Response> {



        const listWorkersUseCase = container.resolve(ListWorkersUseCase)

        const results = await listWorkersUseCase.execute()


        return res.json(results)
    }


}

export { ListWorkersController }