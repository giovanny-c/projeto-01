import { container } from "tsyringe";
import { Request, Response } from "express";

import { CreateDonorUseCase } from "./CreateDonorUseCase";


class CreateDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const { name, email, phone } = req.body

        const createDonorUseCase = container.resolve(CreateDonorUseCase)

        const result = await createDonorUseCase.execute({ name, email, phone })

        return res.redirect("/doadores")
    }


}

export { CreateDonorController }