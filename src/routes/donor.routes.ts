
import { Router } from "express";

import { CreateDonorController } from "../modules/donor/useCases/createDonor/CreateDonorController";
import { ListDonorsController } from "../modules/donor/useCases/listDonors/ListDonorsController";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";

const donorRoutes = Router()

const createDonorController = new CreateDonorController()
const listDonorController = new ListDonorsController()

donorRoutes.post("/", ensureAuthenticated, createDonorController.handle)
donorRoutes.get("/list", ensureAuthenticated, listDonorController.handle)

export { donorRoutes }

