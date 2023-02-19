import { Router } from "express"

import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { LoadLoginPageController } from "../modules/user/useCases/loadLoginPage/LoadLoginPageController"
import { LogOutController } from "../modules/user/useCases/logOut/LogOutController"
import { SendForgotPasswordController } from "../modules/user/useCases/sendForgotPassword/SendForgotPasswordController"

import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
import { handleMessage } from "../shared/middlewares/handleMessage"


const loginRoutes = Router()

const loadLoginPageController = new LoadLoginPageController()
const logOutController = new LogOutController()
const authenticateUserController = new AuthenticateUserController()
const sendForgotPasswordController = new SendForgotPasswordController()

loginRoutes.get("/entrar", handleMessage, loadLoginPageController.handle)

loginRoutes.post("/sessao", authenticateUserController.handle)

loginRoutes.get("/sair", ensureAuthenticated, handleMessage, logOutController.handle) //fazer

loginRoutes.get("/esqueci-a-senha", sendForgotPasswordController.handle)

export {loginRoutes}