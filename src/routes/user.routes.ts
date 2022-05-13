
import { Router } from "express"
import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { CreateUserController } from "../modules/user/useCases/createUser/CreateUserController"
import { RefreshTokenController } from "../modules/user/useCases/refreshToken/RefreshTokenController"
import { SendForgotPasswordController } from "../modules/user/useCases/sendForgotPassword/SendForgotPasswordController"


const userRoutes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()
const sendForgotPasswordController = new SendForgotPasswordController()
const refreshTokenController = new RefreshTokenController()

userRoutes.post("/", createUserController.handle)

userRoutes.post("/sessions", authenticateUserController.handle)

userRoutes.post("/forgot", sendForgotPasswordController.handle)

userRoutes.post("/refresh-token", refreshTokenController.handle)

export { userRoutes }