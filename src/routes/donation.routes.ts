
import { Router } from "express";

import multer from "multer"

import { CancelDonationController } from "../modules/donations/useCases/cancelDonation/CancelDonationController";
import { CreateDonationController } from "../modules/donations/useCases/createDonation/CreateDonationController";
import { CreateNgoController } from "../modules/donations/useCases/createNgo/CreateNgoController";
import { GenerateReceiptController } from "../modules/donations/useCases/generateReceipt/GenerateReceiptController";
import { GetDonationController } from "../modules/donations/useCases/getDonation/GetDonationController";
import { ImportDonationsController } from "../modules/donations/useCases/importDonations/ImportDonationsController";
import { ListDonationsController } from "../modules/donations/useCases/listDonations/ListDonationsController";
import { UpdateDonationStatusController } from "../modules/donations/useCases/updateDonationStatus/UpdateDonationStatusController";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";

const upload = multer({
    dest: "./tmp/"
})

const donationRoutes = Router()


const createDonationController = new CreateDonationController()
const updateDonationStatusController = new UpdateDonationStatusController()
const cancelDonationController = new CancelDonationController()
const listDonationsController = new ListDonationsController()
const importDonationsController = new ImportDonationsController()
const getDonationController = new GetDonationController()
const generateReceiptController = new GenerateReceiptController()
const createNgoController = new CreateNgoController()

//importa os doadores
donationRoutes.post("/import", ensureAuthenticated, upload.single("file"), importDonationsController.handle)

donationRoutes.get("/list", ensureAuthenticated, listDonationsController.handle)
donationRoutes.post("/update-status/:id", ensureAuthenticated, updateDonationStatusController.handle)
donationRoutes.post("/cancel-donation/:id", ensureAuthenticated, cancelDonationController.handle)
donationRoutes.post("/create/:donor_id", ensureAuthenticated, createDonationController.handle)//cria a donation
//donationRoutes.get("/receipt/:id", generateReceiptController.handle)
donationRoutes.get("/:id", /*ensureAuthenticated,*/getDonationController.handle)

//cria a ong
donationRoutes.post("/ngo/create/", ensureAuthenticated, createNgoController.handle)//cria a donation

//altera numero doação
donationRoutes.put("/ngo/donation_counter/update", ensureAuthenticated, createNgoController.handle)//cria a donation


export { donationRoutes } 