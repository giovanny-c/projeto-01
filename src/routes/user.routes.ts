
import { Router } from "express"
import multer from "multer"
import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { CreateUserController } from "../modules/user/useCases/createUser/CreateUserController"
import { LoadCreateUserController } from "../modules/user/useCases/loadCreateUser/LoadCreateUserController.ts"
import { LoadUserController } from "../modules/user/useCases/loadUser/LoadUserController"
import { LoadUsersController } from "../modules/user/useCases/loadUsers/LoadUsersController"
import { LoadUserUpdateController } from "../modules/user/useCases/loadUserUpdate/LoadUserUpdateController"

import { SendForgotPasswordController } from "../modules/user/useCases/sendForgotPassword/SendForgotPasswordController"
import { UpdateUserController } from "../modules/user/useCases/updateUser/UpdateUserController"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"

const upload = multer()

const userRoutes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const sendForgotPasswordController = new SendForgotPasswordController()
const loadUsersController = new LoadUsersController()
const loadUserController = new LoadUserController()
const loadCreateUserController = new LoadCreateUserController()
const loadUserUpdateController = new LoadUserUpdateController()
const updateUserController = new UpdateUserController()

//load all users
userRoutes.get("/", ensureAuthenticated, loadUsersController.handle)


//load criar
userRoutes.get("/criar", ensureAuthenticated, loadCreateUserController.handle)
userRoutes.post("/criar", ensureAuthenticated, upload.none() ,createUserController.handle)

//load forgot
userRoutes.post("/forgot",  ensureAuthenticated ,sendForgotPasswordController.handle)

userRoutes.post("/sessao", authenticateUserController.handle)

//load ver
userRoutes.get("/:user_id", ensureAuthenticated, loadUserController.handle)

//editar 
userRoutes.get("/:user_id/editar", ensureAuthenticated, loadUserUpdateController.handle)
userRoutes.put("/:user_id/editar", ensureAuthenticated, upload.none(), updateUserController.handle)


export { userRoutes }