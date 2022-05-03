import { Request, Response } from "express";
import { container } from "tsyringe";
import { GenerateReceiptUseCase } from "./GenerateReceiptUseCase";



class GenerateReceiptController {


    async handle(req: Request, res: Response): Promise<Response> {

        const { id } = req.params

        const generateReceiptUseCase = container.resolve(GenerateReceiptUseCase)

        await generateReceiptUseCase.execute(id, res)

        return res.send()
    }
}

export { GenerateReceiptController }