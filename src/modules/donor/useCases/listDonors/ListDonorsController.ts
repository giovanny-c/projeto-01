import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListDonorsUseCase } from "./ListDonorsUseCase";


class ListDonorsController {

    async handle(req: Request, res: Response): Promise<any> {

        const {valor: value, limit, pagina: page} = req.query
        const {user} = req

        

        const listDonorsUseCase = container.resolve(ListDonorsUseCase)

        const {donors, search_terms} = await listDonorsUseCase.execute({
            value: value as string,
            limit: +(limit),
            page: +(page),
            user_id: user.id,
            is_admin: user.admin? true : false
        })

       

        return res.render("views/donors/search-donors", {donors, search_terms, username: req.user.name, error: req.error, success: req.success})
    }


}

export { ListDonorsController }