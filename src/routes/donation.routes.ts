
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

donationRoutes.post("/importar", ensureAuthenticated, upload.single("file"), importDonationsController.handle)



//
// donationRoutes.post("/update-status/:id", ensureAuthenticated, updateDonationStatusController.handle)

donationRoutes.post("/criar", ensureAuthenticated, createDonationController.handle)//cria a donation
donationRoutes.get("/listar", ensureAuthenticated, listDonationsController.handle)
donationRoutes.post("/cancelar-doacao/:id", ensureAuthenticated, cancelDonationController.handle)
donationRoutes.get("/:id", /*ensureAuthenticated,*/getDonationController.handle)
//donationRoutes.get("/receipt/:id", generateReceiptController.handle)

//cria a ong
donationRoutes.post("/instituicao/criar", ensureAuthenticated, createNgoController.handle)

//acha as ongs
donationRoutes.get("/instituicao/listagem", ensureAuthenticated, findAllNgosController.handle)


donationRoutes.get("/instituicao/:id/gerar-talao", ensureAuthenticated, generateBookletController.handle)

//altera numero doação
donationRoutes.post("/instituicao/:id/contador/definir", ensureAuthenticated, setDonationCounterController.handle)


//

export { donationRoutes } 