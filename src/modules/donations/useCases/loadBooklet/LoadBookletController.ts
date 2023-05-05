import { Request, Response } from "express";
import { ReadStream } from "fs";

import { container } from "tsyringe";
import { LoadBookletUseCase } from "./LoadBookletUseCase";



class LoadBookletController{


    async handle(req: Request, res: Response): Promise<any> {

        const { ngo_id, year, month, file_name: fileName } = req.params

        const loadBookletUseCase = container.resolve(LoadBookletUseCase)

        const {file_path,  file_name,  ngo} = await loadBookletUseCase.execute({ngo_id, year, month, file_name: fileName})

        return res.status(200).render("views/donations/booklet", {file_path, file_name, ngo, username: req.user.name, error: req.error, success: req.success})
       

        // return res.render("views/donations/booklet", {
        //     file: file.pipe(res),
        //     file_name, ngo, username: req.user.name, error: req.error, success: req.success})

        // .on("finish", () => {
            
        //     // res.render("views/donations/booklet", {file: file, file_name, ngo, username: req.user.name, error: req.error, success: req.success})
        // })
    }
}

export { LoadBookletController} 