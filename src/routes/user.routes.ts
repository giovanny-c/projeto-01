
import { Router } from "express"
import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { CreateUserController } from "../modules/user/useCases/createUser/CreateUserController"
import { LoadUsersController } from "../modules/user/useCases/loadUsers/LoadUsersController"

import { SendForgotPasswordController } from "../modules/user/useCases/sendForgotPassword/SendForgotPasswordController"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"


const userRoutes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const sendForgotPasswordController = new SendForgotPasswordController()
const loadUsersController = new LoadUsersController()

//load all users

userRoutes.get("/", ensureAuthenticated, loadUsersController.handle)


//load criar

userRoutes.post("/criar", ensureAuthenticated, createUserController.handle)

//load forgot
userRoutes.post("/forgot",  ensureAuthenticated ,sendForgotPasswordController.handle)

//load ver e editar 


userRoutes.post("/sessao", authenticateUserController.handle)



export { userRoutes }