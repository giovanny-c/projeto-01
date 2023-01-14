
import { Router } from "express";

import multer from "multer"

import { CancelDonationController } from "../modules/donations/useCases/cancelDonation/CancelDonationController";
import { CreateDonationController } from "../modules/donations/useCases/createDonation/CreateDonationController";
import { CreateNgoController } from "../modules/donations/useCases/createNgo/CreateNgoController";
import { FindAllNgosController } from "../modules/donations/useCases/findAllNgos/FindAllNgosController";
import { GenerateBookletController } from "../modules/donations/useCases/genarateBead/GenerateBookletController";
import { GenerateReceiptController } from "../modules/donations/useCases/generateReceipt/GenerateReceiptController";
import { GetDonationController } from "../modules/donations/useCases/getDonation/GetDonationController";
import { GetNgoController } from "../modules/donations/useCases/getNgo/GetNgoController";
import { ImportDonationsController } from "../modules/donations/useCases/importDonations/ImportDonationsController";
import { ListDonationsController } from "../modules/donations/useCases/listDonations/ListDonationsController";
import { LoadDonationCounterPageController } from "../modules/donations/useCases/loadDonationCounterPage/loadDonationCounterPageController";
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
const getNgoController = new GetNgoController()
const loadDonationCounterPageController = new LoadDonationCounterPageController()



//importa os doadores

//importa doaçoes

donationRoutes.post("/importar", ensureAuthenticated, upload.single("file"), importDonationsController.handle)


//pagina inicial mostra todas as ongs

//cria a ong
donationRoutes.post("/instituicao/criar", ensureAuthenticated, createNgoController.handle)

donationRoutes.get("/", ensureAuthenticated, findAllNgosController.handle)
//pagina da ong
donationRoutes.get("/instituicao/:id", ensureAuthenticated, getNgoController.handle)

//gerar talao
donationRoutes.get("/instituicao/:id/gerar-talao", ensureAuthenticated, generateBookletController.handle)

//altera numero doação
donationRoutes.get("/instituicao/:id/contador/", ensureAuthenticated, loadDonationCounterPageController.handle)
donationRoutes.post("/instituicao/:id/contador/definir", ensureAuthenticated, setDonationCounterController.handle)

donationRoutes.post("/instituicao/:id/doacao/nova", ensureAuthenticated, createDonationController.handle)//cria a donation
donationRoutes.get("/instituicao/:id/doacao/listar", ensureAuthenticated, listDonationsController.handle)
donationRoutes.get("/instituicao/:id/doacao/:id", ensureAuthenticated, getDonationController.handle)
donationRoutes.post("/instituicao/:id/doacao/:id/cancelar-doacao/", ensureAuthenticated, cancelDonationController.handle)
//donationRoutes.get("/receipt/:id", generateReceiptController.handle)


// donationRoutes.post("/update-status/:id", ensureAuthenticated, updateDonationStatusController.handle)




//

export { donationRoutes } 