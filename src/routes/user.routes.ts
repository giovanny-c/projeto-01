
import { Router } from "express"
import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { CreateUserController } from "../modules/user/useCases/createUser/CreateUserController"

import { SendForgotPasswordController } from "../modules/user/useCases/sendForgotPassword/SendForgotPasswordController"


const userRoutes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const sendForgotPasswordController = new SendForgotPasswordController()


userRoutes.post("/", createUserController.handle)

userRoutes.post("/sessions", authenticateUserController.handle)

userRoutes.post("/forgot", sendForgotPasswordController.handle)



export { userRoutes }