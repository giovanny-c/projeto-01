
import { Router } from "express";

import { CreateDonationController } from "../modules/donations/useCases/CreateDonationController";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";

const donationRoutes = Router()

const createDonationController = new CreateDonationController()

donationRoutes.post("/:donor_id", ensureAuthenticated, createDonationController.handle)

export { donationRoutes }