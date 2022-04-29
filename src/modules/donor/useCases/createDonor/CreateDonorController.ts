import { container } from "tsyringe";
import { Request, Response } from "express";

import { CreateDonorUseCase } from "./CreateDonorUseCase";


class CreateDonorController {

    async handle(req: Request, res: Response): Promise<Response> {

        const { name, email, phone } = req.body

        const createDonorUseCase = container.resolve(CreateDonorUseCase)

        const result = await createDonorUseCase.execute({ name, email, phone })

        return res.json(result)
    }


}

export { CreateDonorController }