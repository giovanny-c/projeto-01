import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListWorkersUseCase } from "./ListWorkersUseCase";



class ListWorkersController {

    async handle(req: Request, res: Response): Promise<any> {



        const listWorkersUseCase = container.resolve(ListWorkersUseCase)

        const workers = await listWorkersUseCase.execute()
        console.log(workers)

        return res.status(200).render("views/workers/workers", {workers, username: req.user.name, error: req.error, success: req.success})
    }


}

export { ListWorkersController }