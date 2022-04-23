
import { Router } from "express";

import { CreateDonorController } from "../modules/donor/useCases/createDonor/CreateDonorController";

const donorRoutes = Router()

const createDonorController = new CreateDonorController()

donorRoutes.post("/", createDonorController.handle)

export { donorRoutes }

