import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadSetNgoEmailUseCase } from "./LoadSetNgoEmailUseCase";





class LoadSetNgoEmailController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params

        const loadSetNgoEmail = container.resolve(LoadSetNgoEmailUseCase)

        const {ngo, email} = await loadSetNgoEmail.execute({ngo_id})

        return res.status(200).render("views/ngos/set-email", {ngo, email, error: req.error, success: req.success})

    }


}

export { LoadSetNgoEmailController}