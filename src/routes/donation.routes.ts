
import { Router } from "express";

import multer from "multer"

import { CancelDonationController } from "../modules/donations/useCases/cancelDonation/CancelDonationController";
import { CreateDonationController } from "../modules/donations/useCases/createDonation/CreateDonationController";
import { CreateNgoController } from "../modules/donations/useCases/createNgo/CreateNgoController";
import { FindAllNgosController } from "../modules/donations/useCases/findAllNgos/FindAllNgosController";
import { GenerateBookletController } from "../modules/donations/useCases/generateBooklet/GenerateBookletController";
import { GenerateReceiptController } from "../modules/donations/useCases/generateReceipt/GenerateReceiptController";
import { GetBalanceController } from "../modules/donations/useCases/getBalance/GetBalanceController";
import { GetDonationController } from "../modules/donations/useCases/getDonation/GetDonationController";
import { GetLastDonationController } from "../modules/donations/useCases/getLasDonation/GetLastDonationController";
import { GetNgoController } from "../modules/donations/useCases/getNgo/GetNgoController";
import { ImportDonationsController } from "../modules/donations/useCases/importDonations/ImportDonationsController";
import { ListDonationsController } from "../modules/donations/useCases/listDonations/ListDonationsController";
import { LoadBookletController } from "../modules/donations/useCases/loadBooklet/LoadBookletController";
import { LoadCreateDonationController } from "../modules/donations/useCases/loadCreateDonationPage/LoadCreateDonationController";
import { LoadDonationCounterPageController } from "../modules/donations/useCases/loadDonationCounterPage/LoadDonationCounterPageController";
import { LoadGenerateBookletController } from "../modules/donations/useCases/loadGenerateBooklet/LoadGenerateBookletController";
import { LoadImportDonationsController } from "../modules/donations/useCases/loadImportDonations/LoadImportDonationsController";

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
const loadCreateDonationController = new LoadCreateDonationController()
const getLastDonationController = new GetLastDonationController()
const loadGenerateBookletController = new LoadGenerateBookletController()
const loadBookletController = new LoadBookletController()
const getBalanceController = new GetBalanceController()
const loadImportDonationsController = new LoadImportDonationsController()





//cria a ong
donationRoutes.post("/instituicao/criar", ensureAuthenticated, createNgoController.handle)

//inicio//pagina inicial mostra todas as ongs
donationRoutes.get("/", ensureAuthenticated, findAllNgosController.handle)

//pagina da ong
donationRoutes.get("/instituicao/:id", ensureAuthenticated, getNgoController.handle)

//gerar talao
donationRoutes.get("/instituicao/:ngo_id/gerar-talao",  ensureAuthenticated, loadGenerateBookletController.handle)
donationRoutes.post("/instituicao/:ngo_id/gerar-talao", upload.none(), ensureAuthenticated, generateBookletController.handle)
//mostrar talao
donationRoutes.get("/instituicao/:ngo_id/talao/:year/:month/:file_name", ensureAuthenticated, loadBookletController.handle )

//altera numero contador de doação
donationRoutes.get("/instituicao/:id/contador/",  ensureAuthenticated,   loadDonationCounterPageController.handle)
donationRoutes.post("/instituicao/:id/contador/definir", upload.none(), ensureAuthenticated, setDonationCounterController.handle)

//criar nova doação
donationRoutes.get("/instituicao/:id/doacao/nova", ensureAuthenticated, loadCreateDonationController.handle )
donationRoutes.post("/instituicao/:id/doacao/nova/criar", upload.none(), ensureAuthenticated, createDonationController.handle)//cria a donation

//listar
donationRoutes.get("/instituicao/:ngo_id/doacao/listar", ensureAuthenticated, listDonationsController.handle)

//importar
donationRoutes.get("/instituicao/:ngo_id/doacao/importar", ensureAuthenticated, loadImportDonationsController.handle)
donationRoutes.post("/instituicao/:ngo_id/doacao/importar", ensureAuthenticated, upload.single("file"), importDonationsController.handle)

//pegar doaçao
donationRoutes.get("/instituicao/:ngo_id/doacao/ultima", ensureAuthenticated, getLastDonationController.handle)
donationRoutes.get("/instituicao/:ngo_id/doacao/:donation_number", ensureAuthenticated, getDonationController.handle)

//deletar doaçao
donationRoutes.post("/instituicao/:ngo_id/doacao/:donation_number/cancelar-doacao/", ensureAuthenticated, cancelDonationController.handle)

//balanco
donationRoutes.get("/instituicao/:ngo_id/balanco", ensureAuthenticated, getBalanceController.handle)


// donationRoutes.post("/update-status/:id", ensureAuthenticated, updateDonationStatusController.handle)




//

export { donationRoutes } 