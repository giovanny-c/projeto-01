import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadSetEmailMessageUseCase } from "./LoadSetEmailMessageUseCase";





class LoadSetEmailMessageController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id } = req.params

        const loadSetEmailMessage = container.resolve(LoadSetEmailMessageUseCase)

        const {ngo} = await loadSetEmailMessage.execute({ngo_id})

        return res.status(200).render("views/ngos/create-message", {ngo, username: req.user.name, error: req.error, success: req.success})

    }


}

export { LoadSetEmailMessageController}