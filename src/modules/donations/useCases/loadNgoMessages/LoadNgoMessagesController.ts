import { container } from "tsyringe";
import { Request, Response } from "express";
import { LoadNgoMessagesUseCase } from "./LoadNgoMessagesUseCase";





class LoadNgoMessagesController {

    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id} = req.params
        
        
        const loadEmailMessages = container.resolve(LoadNgoMessagesUseCase)

        const {ngo, messages} = await loadEmailMessages.execute(ngo_id)
        
        return res.status(201).render("views/ngos/ngo-messages", {ngo, messages, error: req.error, success: req.success})

    }


}

export {LoadNgoMessagesController }