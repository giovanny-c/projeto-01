import { container } from "tsyringe";
import { Request, Response } from "express";
import { ListDonationsUseCase } from "./ListDonationsUseCase";
import { stringify } from "uuid";



class ListDonationsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { value, orderBy, limit, offset, startDate, endDate } = req.query


        const listDonationsUseCase = container.resolve(ListDonationsUseCase)

        const results = await listDonationsUseCase.execute({
            value: value as string,
            orderBy: orderBy as string,
            limit: limit as any,
            offset: offset as any,
            startDate: startDate as string,
            endDate: endDate as string
        })

        return res.json(results)
    }
}

export { ListDonationsController }