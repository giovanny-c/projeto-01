import { Router } from "express"
import { LoadLoginPageController } from "../modules/user/useCases/loadLoginPage/LoadLoginPageController"


const loginRoutes = Router()

const loadLoginPageController = new LoadLoginPageController()


loginRoutes.get("/entrar", loadLoginPageController.handle)

loginRoutes.post("/sair") //fazer

export {loginRoutes}