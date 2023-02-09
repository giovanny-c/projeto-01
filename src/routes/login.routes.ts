import { Router } from "express"

import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { LoadLoginPageController } from "../modules/user/useCases/loadLoginPage/LoadLoginPageController"
import { LogOutController } from "../modules/user/useCases/logOut/LogOutController"

import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"


const loginRoutes = Router()

const loadLoginPageController = new LoadLoginPageController()
const logOutController = new LogOutController()
const authenticateUserController = new AuthenticateUserController()

loginRoutes.get("/entrar", loadLoginPageController.handle)

loginRoutes.post("/sessao", authenticateUserController.handle)

loginRoutes.get("/sair", ensureAuthenticated, logOutController.handle) //fazer

export {loginRoutes}