import { Request, Response } from "express";


class LoadImportDonorController {

    async handle(req: Request, res: Response): Promise<any> {

        const file_path = "./examples/exemplo_importar_doador.xlsx"
        const file_name = "exemplo_importar_doador"

        return res.render("views/donors/import-donors", {ngos: req.ngos, file_path, file_name, username: req.user.name, error: req.error, success: req.success})
    }


}

export { LoadImportDonorController }