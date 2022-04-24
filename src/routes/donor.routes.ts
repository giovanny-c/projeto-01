
import { Router } from "express";

import { CreateDonorController } from "../modules/donor/useCases/createDonor/CreateDonorController";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";

const donorRoutes = Router()

const createDonorController = new CreateDonorController()

donorRoutes.post("/", ensureAuthenticated, createDonorController.handle)

export { donorRoutes }

