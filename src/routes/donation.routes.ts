
import { Router } from "express";

import { CreateDonationController } from "../modules/donations/useCases/CreateDonationController";

const donationRoutes = Router()

const createDonationController = new CreateDonationController()

donationRoutes.post("/:donor_id", createDonationController.handle)

export { donationRoutes }