import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateDonorUseCase } from "./UpdateDonorUseCase";


class UpdateDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const { donor_id: id } = req.params

        const { name, email, phone, worker_id, send_by_message } = req.body

        const {id: user_id} = req.user

        const updateDonorUseCase = container.resolve(UpdateDonorUseCase)

        const {donor} = await updateDonorUseCase.execute({ id, name, email, phone, worker_id, user_id, send_by_message})

        return res.redirect(`/doadores/${donor.id}`)
    }


}

export { UpdateDonorController }