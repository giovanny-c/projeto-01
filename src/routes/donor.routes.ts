
import { Router } from "express";

import multer from "multer";

import { CreateDonorController } from "../modules/donor/useCases/createDonor/CreateDonorController";
import { GetDonorAndDonationsController } from "../modules/donor/useCases/GetDonoraAndDonations/GetDonorAndDonationsController";
import { ListDonorsController } from "../modules/donor/useCases/listDonors/ListDonorsController";
import { UpdateDonorController } from "../modules/donor/useCases/updateDonor/UpdateDonorController";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";

const upload = multer()

const donorRoutes = Router()

const createDonorController = new CreateDonorController()
const listDonorController = new ListDonorsController()
const getDonorAndDonationsController = new GetDonorAndDonationsController()
const updateDonorController = new UpdateDonorController()

donorRoutes.post("/", ensureAuthenticated, createDonorController.handle)
donorRoutes.get("/list", ensureAuthenticated, listDonorController.handle)
donorRoutes.get("/:id", ensureAuthenticated, getDonorAndDonationsController.handle)
donorRoutes.put("/:id/update", ensureAuthenticated, upload.none(), updateDonorController.handle)


export { donorRoutes }

