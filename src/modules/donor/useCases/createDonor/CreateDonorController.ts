import { container } from "tsyringe";
import { Request, Response } from "express";

import { CreateDonorUseCase } from "./CreateDonorUseCase";


class CreateDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const { name, email, phone } = req.body

        const _phone = phone.replace(/[\(\)]/,"") //tira os ()

        const createDonorUseCase = container.resolve(CreateDonorUseCase)

        await createDonorUseCase.execute({ name, email, phone: _phone })

        return res.redirect("/doadores")
    }


}

export { CreateDonorController }