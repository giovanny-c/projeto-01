import { container } from "tsyringe";
import { Request, Response } from "express";
import { ListDonationsUseCase } from "./ListDonationsUseCase";
import { stringify } from "uuid";



class ListDonationsController {

    async handle(req: Request, res: Response): Promise<any> {

        const { orderBy, limit, offset, startDate, endDate, worker_name, donor_name} = req.query
        const {ngo_id} = req.params
        

        const listDonationsUseCase = container.resolve(ListDonationsUseCase)

        const {sum, donations, ngo} = await listDonationsUseCase.execute({
            orderBy: orderBy as string,
            limit: limit as any,
            offset: offset as any,
            startDate: startDate as string,
            endDate: endDate as string,
            donor_name: donor_name as string,
            ngo_id: ngo_id as string,
            worker_name: worker_name as string
        })

        return res.status(200).render("views/donations/search-donations", {donations, sum, ngo})
    }
}

export { ListDonationsController }