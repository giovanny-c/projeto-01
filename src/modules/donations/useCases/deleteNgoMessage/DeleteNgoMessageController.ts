import { container } from "tsyringe";
import { Request, Response } from "express";
import { DeleteNgoMessageUseCase } from "./DeleteNgoMessageUseCase";





class DeleteNgoMessageController {

    async handle(req: Request, res: Response): Promise<any> {

        const {ngo_id} = req.params
        
        const { message_id} = req.body
        
        const DeleteEmailMessage = container.resolve(DeleteNgoMessageUseCase)

        const {ngo} = await DeleteEmailMessage.execute(message_id, ngo_id)
        
        return res.status(201).redirect(`/instituicao/${ngo.id}/mensagens`)

    }


}

export {DeleteNgoMessageController }