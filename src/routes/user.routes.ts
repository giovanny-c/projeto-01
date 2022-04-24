
import { Router } from "express"
import { AuthenticateUserController } from "../modules/user/useCases/authenticateUser/AuthenticateUserController"
import { CreateUserController } from "../modules/user/useCases/createUser/CreateUserController"


const userRoutes = Router()

const createUserController = new CreateUserController()
const authenticateUserController = new AuthenticateUserController()

userRoutes.post("/", createUserController.handle)

userRoutes.post("/sessions", authenticateUserController.handle)


export { userRoutes }