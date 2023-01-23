import { Request, Response } from "express";
import { y } from "pdfkit";
import { container } from "tsyringe";
import { GenerateBookletUseCase } from "./GenerateBookletUseCase";


class GenerateBookletController {

    async handle(req: Request, res: Response): Promise<any>{

        const {first_number, last_number} = req.body
        const {ngo_id} = req.params

        const generateBooklet = container.resolve(GenerateBookletUseCase)

        const {file_name, month, year, ngo} = await generateBooklet.execute({first_number: +(first_number), last_number: +(last_number), ngo_id})

        return res.status(201).redirect(`/instituicao/${ngo.id}/talao/${year}/${month}/${file_name}`)
    }   


}

export{GenerateBookletController}