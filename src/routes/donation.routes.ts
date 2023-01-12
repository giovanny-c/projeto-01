
import { Router } from "express";

import multer from "multer"

import { CancelDonationController } from "../modules/donations/useCases/cancelDonation/CancelDonationController";
import { CreateDonationController } from "../modules/donations/useCases/createDonation/CreateDonationController";
import { CreateNgoController } from "../modules/donations/useCases/createNgo/CreateNgoController";
import { FindAllNgosController } from "../modules/donations/useCases/findAllNgos/FindAllNgosController";
import { GenerateBookletController } from "../modules/donations/useCases/genarateBead/GenerateBookletController";
import { GenerateReceiptController } from "../modules/donations/useCases/generateReceipt/GenerateReceiptController";
import { GetDonationController } from "../modules/donations/useCases/getDonation/GetDonationController";
import { ImportDonationsController } from "../modules/donations/useCases/importDonations/ImportDonationsController";
import { ListDonationsController } from "../modules/donations/useCases/listDonations/ListDonationsController";
import { SetDonationCounterController } from "../modules/donations/useCases/setDonationCounter/SetDonationCounterController";

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
const findAllNgosController = new FindAllNgosController() 
const setDonationCounterController = new SetDonationCounterController()
const generateBookletController = new GenerateBookletController()

//importa os doadores
//importa doaçoes

donationRoutes.post("/import", ensureAuthenticated, upload.single("file"), importDonationsController.handle)



//
// donationRoutes.post("/update-status/:id", ensureAuthenticated, updateDonationStatusController.handle)

donationRoutes.post("/create", ensureAuthenticated, createDonationController.handle)//cria a donation
donationRoutes.post("/cancel-donation/:id", ensureAuthenticated, cancelDonationController.handle)

donationRoutes.get("/list", ensureAuthenticated, listDonationsController.handle)
donationRoutes.get("/:id", /*ensureAuthenticated,*/getDonationController.handle)
//donationRoutes.get("/receipt/:id", generateReceiptController.handle)

//cria a ong
donationRoutes.post("/ngo/create/", ensureAuthenticated, createNgoController.handle)//cria a donation
//acha as ongs
donationRoutes.get("/ngo/list/", ensureAuthenticated, findAllNgosController.handle)//cria a donation


donationRoutes.get("/ngo/create-booklet", ensureAuthenticated, generateBookletController.handle)

//altera numero doação
donationRoutes.post("/ngo/donation_counter/set", ensureAuthenticated, setDonationCounterController.handle)//cria a donation


//

export { donationRoutes } 