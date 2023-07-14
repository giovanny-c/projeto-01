import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadNgoMessageUseCase } from "./LoadNgoMessageUseCase";





class LoadNgoMessageController {

    async handle(req: Request, res: Response): Promise<any> {

        const {message_id} = req.params
        
        
        const loadEmailMessages = container.resolve(LoadNgoMessageUseCase)

        const {ngo, message} = await loadEmailMessages.execute(message_id)
        
        return res.status(201).render("views/ngos/ngo-message", {ngos: req.ngos, ngo, message, username: req.user.name, error: req.error, success: req.success})

    }


}

export {LoadNgoMessageController }