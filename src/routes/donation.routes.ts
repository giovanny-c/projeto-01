
import { Router } from "express";

import multer from "multer"
import uploadConfig from "../config/upload"

import { CancelDonationController } from "../modules/donations/useCases/cancelDonation/CancelDonationController";
import { CreateDonationController } from "../modules/donations/useCases/createDonation/CreateDonationController";
import { CreateNgoController } from "../modules/donations/useCases/createNgo/CreateNgoController";
import { FindAllNgosController } from "../modules/donations/useCases/findAllNgos/FindAllNgosController";
import { GenerateBookletController } from "../modules/donations/useCases/generateBooklet/GenerateBookletController";
import { GenerateReceiptController } from "../modules/donations/useCases/generateReceipt/GenerateReceiptController";
import { GetBalanceController } from "../modules/donations/useCases/getBalance/GetBalanceController";
import { GetDonationController } from "../modules/donations/useCases/getDonation/GetDonationController";
import { GetNgoController } from "../modules/donations/useCases/getNgo/GetNgoController";
import { ImportDonationsController } from "../modules/donations/useCases/importDonations/ImportDonationsController";
import { ListDonationsController } from "../modules/donations/useCases/listDonations/ListDonationsController";
import { LoadBookletController } from "../modules/donations/useCases/loadBooklet/LoadBookletController";
import { LoadCreateDonationController } from "../modules/donations/useCases/loadCreateDonationPage/LoadCreateDonationController";
import { LoadCreateNgoController } from "../modules/donations/useCases/loadCreateNgo/LoadCreateNgoController";
import { LoadDonationCounterPageController } from "../modules/donations/useCases/loadDonationCounterPage/LoadDonationCounterPageController";
import { LoadGenerateBookletController } from "../modules/donations/useCases/loadGenerateBooklet/LoadGenerateBookletController";
import { LoadImportDonationsController } from "../modules/donations/useCases/loadImportDonations/LoadImportDonationsController";
import { LoadSetEmailMessageController } from "../modules/donations/useCases/loadSetEmailMessage/LoadSetEmailMessageController";
import { LoadSetNgoEmailController } from "../modules/donations/useCases/loadSetNgoEmail/LoadSetNgoEmailController";
import { SendReceiptEmailController } from "../modules/donations/useCases/sendReceiptEmail/SendReceiptEmailController";

import { SetDonationCounterController } from "../modules/donations/useCases/setDonationCounter/SetDonationCounterController";
import { SetEmailMessageController } from "../modules/donations/useCases/setEmaiMessage/SetEmailMessageController";
import { SetNgoEmailController } from "../modules/donations/useCases/setNgoEmail/SetNgoEmailController";

// import { UpdateDonationStatusController } from "../modules/donations/useCases/updateDonationStatus/UpdateDonationStatusController";
import { ensureAdmin } from "../shared/middlewares/ensureAdmin";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";
import { handleMessage } from "../shared/middlewares/handleMessage";



const upload = multer(uploadConfig)

const donationRoutes = Router()


const createDonationController = new CreateDonationController()
// const updateDonationStatusController = new UpdateDonationStatusController()
const cancelDonationController = new CancelDonationController()
const listDonationsController = new ListDonationsController()
const importDonationsController = new ImportDonationsController()
const getDonationController = new GetDonationController()

const createNgoController = new CreateNgoController()
const findAllNgosController = new FindAllNgosController() 
const setDonationCounterController = new SetDonationCounterController()
const generateBookletController = new GenerateBookletController()
const getNgoController = new GetNgoController()
const loadDonationCounterPageController = new LoadDonationCounterPageController()
const loadCreateDonationController = new LoadCreateDonationController()

const loadGenerateBookletController = new LoadGenerateBookletController()
const loadBookletController = new LoadBookletController()
const getBalanceController = new GetBalanceController()
const loadImportDonationsController = new LoadImportDonationsController()
const loadCreateNgoController = new LoadCreateNgoController()

const setNgoEmailController = new SetNgoEmailController()
const setEmailMessageController = new SetEmailMessageController()
const loadSetNgoEmailController = new LoadSetNgoEmailController()
const loadSetEmailMessageController = new LoadSetEmailMessageController()

const sendReceiptEmailController = new SendReceiptEmailController()

//inicio//pagina inicial mostra todas as ongs
donationRoutes.get("/", ensureAuthenticated,  handleMessage, findAllNgosController.handle)

//fazer a view
donationRoutes.get("/instituicao/criar", ensureAdmin, handleMessage, loadCreateNgoController.handle)
donationRoutes.post("/instituicao/criar", ensureAdmin, upload.none(), createNgoController.handle)

//pagina da ong
donationRoutes.get("/instituicao/:id", handleMessage, getNgoController.handle)

//gerar talao
donationRoutes.get("/instituicao/:ngo_id/gerar-talao", ensureAdmin, handleMessage, loadGenerateBookletController.handle)
donationRoutes.post("/instituicao/:ngo_id/gerar-talao", ensureAdmin, upload.none(), generateBookletController.handle)

//mostrar talao
donationRoutes.get("/instituicao/:ngo_id/talao/:year/:month/:file_name", ensureAdmin, handleMessage, loadBookletController.handle )

//altera numero contador de doação
donationRoutes.get("/instituicao/:id/contador/", ensureAdmin, handleMessage, loadDonationCounterPageController.handle)
donationRoutes.post("/instituicao/:id/contador/definir", ensureAdmin, upload.none(), setDonationCounterController.handle)

//criar nova doação
donationRoutes.get("/instituicao/:id/doacao/nova", handleMessage, loadCreateDonationController.handle )
donationRoutes.post("/instituicao/:id/doacao/nova/criar", upload.none(), createDonationController.handle)//cria a donation

//listar
donationRoutes.get("/instituicao/:ngo_id/doacao/listar", ensureAdmin, handleMessage, listDonationsController.handle)

//importar
donationRoutes.get("/instituicao/:ngo_id/doacao/importar", ensureAdmin, handleMessage, loadImportDonationsController.handle)
donationRoutes.post("/instituicao/:ngo_id/doacao/importar", ensureAdmin, upload.single("file"), importDonationsController.handle)

//pegar doaçao
donationRoutes.get("/instituicao/:ngo_id/doacao/ultima", ensureAdmin, handleMessage, getDonationController.handle)
donationRoutes.get("/instituicao/:ngo_id/doacao/:donation_number", ensureAdmin, handleMessage, getDonationController.handle)

//cancelar doaçao
donationRoutes.post("/instituicao/:ngo_id/doacao/:donation_number/cancelar-doacao/", ensureAdmin, cancelDonationController.handle)

//balanco
donationRoutes.get("/instituicao/:ngo_id/balanco", ensureAdmin, handleMessage, getBalanceController.handle)

donationRoutes.get("/instituicao/:ngo_id/definir-email", ensureAdmin, handleMessage, loadSetNgoEmailController.handle)
donationRoutes.post("/instituicao/:ngo_id/definir-email", ensureAdmin, upload.none(), setNgoEmailController.handle)

donationRoutes.get("/instituicao/:ngo_id/criar-mensagem", ensureAdmin, handleMessage, loadSetEmailMessageController.handle)
donationRoutes.post("/instituicao/:ngo_id/criar-mensagem", ensureAdmin, upload.none(), setEmailMessageController.handle)

donationRoutes.post("/instituicao/:ngo_id/doacao/:donation_number/enviar-email", ensureAdmin, upload.none(), sendReceiptEmailController.handle )
// donationRoutes.post("/update-status/:id", ensureAuthenticated, updateDonationStatusController.handle)




//

export { donationRoutes } 