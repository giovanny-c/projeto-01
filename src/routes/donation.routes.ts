
import { Router } from "express";
import { CancelDonationController } from "../modules/donations/useCases/cancelDonation/CancelDonationController";

import { CreateDonationController } from "../modules/donations/useCases/createDonation/CreateDonationController";
import { UpdateDonationStatusController } from "../modules/donations/useCases/updateDonationStatus/UpdateDonationStatusController";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";

const donationRoutes = Router()

const createDonationController = new CreateDonationController()
const updateDonationStatusController = new UpdateDonationStatusController()
const cancelDonationController = new CancelDonationController

donationRoutes.post("/:donor_id", ensureAuthenticated, createDonationController.handle)
donationRoutes.post("/update-status/:id", ensureAuthenticated, updateDonationStatusController.handle)
donationRoutes.post("/cancel-donation/:id", ensureAuthenticated, cancelDonationController.handle)

export { donationRoutes }