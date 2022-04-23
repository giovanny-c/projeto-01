
import { Router } from "express"

import createUserController from "../modules/user/useCases/createUser"

const userRoutes = Router()

userRoutes.post("/", (req, res) => {
    return createUserController().handle(req, res)
})

export { userRoutes }