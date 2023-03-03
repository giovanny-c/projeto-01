import { Router } from "express"
import multer from "multer"
import uploadConfig from "../config/upload"

import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { LoadForgotFormController } from "../modules/user/useCases/loadForgotForm/LoadForgotFormController"
import { LoadLoginPageController } from "../modules/user/useCases/loadLoginPage/LoadLoginPageController"
import { LogOutController } from "../modules/user/useCases/logOut/LogOutController"
import { SendForgotPasswordController } from "../modules/user/useCases/sendForgotPassword/SendForgotPasswordController"

import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
import { handleMessage } from "../shared/middlewares/handleMessage"

const upload = multer(uploadConfig)
const loginRoutes = Router()

const loadLoginPageController = new LoadLoginPageController()
const logOutController = new LogOutController()
const authenticateUserController = new AuthenticateUserController()
const sendForgotPasswordController = new SendForgotPasswordController()
const loadForgotFormController = new LoadForgotFormController()

loginRoutes.get("/entrar", handleMessage, loadLoginPageController.handle)

loginRoutes.post("/sessao", upload.none(), authenticateUserController.handle)

loginRoutes.get("/sair", ensureAuthenticated, handleMessage, logOutController.handle) //fazer

loginRoutes.get("/esqueci-a-senha", handleMessage, loadForgotFormController.handle)

loginRoutes.post("/enviar-email-de-recuperacao", upload.none(), sendForgotPasswordController.handle )

//"recuperar-senha"

export {loginRoutes}