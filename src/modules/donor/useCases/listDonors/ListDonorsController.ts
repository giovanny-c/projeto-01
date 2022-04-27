import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListDonorsUseCase } from "./ListDonorsUseCase";


class ListDonorsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const value = req.query.value as string

        const listDonorsUseCase = container.resolve(ListDonorsUseCase)

        const results = await listDonorsUseCase.execute(value)

        return res.json(results)
    }


}

export { ListDonorsController }