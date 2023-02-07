
import { Router } from "express"
import multer from "multer"
import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { CreateUserController } from "../modules/user/useCases/createUser/CreateUserController"
import { LoadCreateUserController } from "../modules/user/useCases/loadCreateUser/LoadCreateUserController.ts"
import { LoadUserController } from "../modules/user/useCases/loadUser/LoadUserController"
import { LoadUsersController } from "../modules/user/useCases/loadUsers/LoadUsersController"

import { SendForgotPasswordController } from "../modules/user/useCases/sendForgotPassword/SendForgotPasswordController"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"

const upload = multer()

const userRoutes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const sendForgotPasswordController = new SendForgotPasswordController()
const loadUsersController = new LoadUsersController()
const loadUserController = new LoadUserController()
const loadCreateUserController = new LoadCreateUserController()

//load all users

userRoutes.get("/", ensureAuthenticated, loadUsersController.handle)


//load criar

userRoutes.get("/criar", ensureAuthenticated, loadCreateUserController.handle)
userRoutes.post("/criar", ensureAuthenticated, upload.none() ,createUserController.handle)

//load forgot
userRoutes.post("/forgot",  ensureAuthenticated ,sendForgotPasswordController.handle)

//load ver e editar 


userRoutes.post("/sessao", authenticateUserController.handle)


userRoutes.get("/:user_id", ensureAuthenticated, loadUserController.handle)


export { userRoutes }