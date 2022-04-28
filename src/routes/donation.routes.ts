
import { Router } from "express";

import multer from "multer"

import { CancelDonationController } from "../modules/donations/useCases/cancelDonation/CancelDonationController";
import { CreateDonationController } from "../modules/donations/useCases/createDonation/CreateDonationController";
import { ImportDonationsController } from "../modules/donations/useCases/importDonations/ImportDonationsController";
import { ListDonationsController } from "../modules/donations/useCases/listDonations/ListDonationsController";
import { UpdateDonationStatusController } from "../modules/donations/useCases/updateDonationStatus/UpdateDonationStatusController";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";

const upload = multer({
    dest: "./tmp"
})

const donationRoutes = Router()


const createDonationController = new CreateDonationController()
const updateDonationStatusController = new UpdateDonationStatusController()
const cancelDonationController = new CancelDonationController()
const listDonationsController = new ListDonationsController()
const importDonationsController = new ImportDonationsController()

donationRoutes.post("/:donor_id", ensureAuthenticated, createDonationController.handle)
donationRoutes.post("/update-status/:id", ensureAuthenticated, updateDonationStatusController.handle)
donationRoutes.post("/cancel-donation/:id", ensureAuthenticated, cancelDonationController.handle)
donationRoutes.get("/list", ensureAuthenticated, listDonationsController.handle)
donationRoutes.post("/import", ensureAuthenticated, upload.single("file"), importDonationsController.handle)

export { donationRoutes }