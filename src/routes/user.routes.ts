
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
import { ensureAdmin } from "../shared/middlewares/ensureAdmin"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
import { handleMessage } from "../shared/middlewares/handleMessage"

const upload = multer()

const userRoutes = Router()

const createUserController = new CreateUserController()
const sendForgotPasswordController = new SendForgotPasswordController()
const loadUsersController = new LoadUsersController()
const loadUserController = new LoadUserController()
const loadCreateUserController = new LoadCreateUserController()
const loadUserUpdateController = new LoadUserUpdateController()
const updateUserController = new UpdateUserController()


userRoutes.use(ensureAdmin)

//load all users
userRoutes.get("/",  handleMessage, loadUsersController.handle)


//load criar
userRoutes.get("/criar", handleMessage, loadCreateUserController.handle)
userRoutes.post("/criar",  upload.none() ,createUserController.handle)

//load forgot
userRoutes.post("/forgot", sendForgotPasswordController.handle)


//load ver
userRoutes.get("/:user_id", handleMessage, loadUserController.handle)

//editar 
userRoutes.get("/:user_id/editar", handleMessage, loadUserUpdateController.handle)
userRoutes.put("/:user_id/editar",  upload.none(), updateUserController.handle)


export { userRoutes }