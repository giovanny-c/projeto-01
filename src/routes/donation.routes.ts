
import { Router } from "express";

import multer from "multer"
import uploadConfig from "../config/upload"

import { CancelDonationController } from "../modules/donations/useCases/cancelDonation/CancelDonationController";
import { CreateDonationController } from "../modules/donations/useCases/createDonation/CreateDonationController";
import { CreateNgoController } from "../modules/donations/useCases/createNgo/CreateNgoController";
import { DeleteNgoController } from "../modules/donations/useCases/deleteNgo/DeleteNgoController";
import { DeleteNgoMessageController } from "../modules/donations/useCases/deleteNgoMessage/DeleteNgoMessageController";
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
import { LoadNgoMessageController } from "../modules/donations/useCases/loadNgoMessage/LoadNgoMessageController";
import { LoadNgoMessagesController } from "../modules/donations/useCases/loadNgoMessages/LoadNgoMessagesController";
import { LoadSetEmailMessageController } from "../modules/donations/useCases/loadSetEmailMessage/LoadSetEmailMessageController";
import { LoadSetNgoEmailController } from "../modules/donations/useCases/loadSetNgoEmail/LoadSetNgoEmailController";
import { LoadUpdateDonationController } from "../modules/donations/useCases/loadUpdateDonation/LoadUpdateDonationController";
import { LoadUpdateNgoController } from "../modules/donations/useCases/loadUpdateNgo/LoadUpdateNgoController";
import { ManageAllNgosController } from "../modules/donations/useCases/manageAllNgos/ManageAllNgosController";
import { ManageNgoController } from "../modules/donations/useCases/manageNgo/ManageNgoController";
import { SendReceiptEmailController } from "../modules/donations/useCases/sendReceiptEmail/SendReceiptEmailController";

import { SetDonationCounterController } from "../modules/donations/useCases/setDonationCounter/SetDonationCounterController";
import { SetEmailMessageController } from "../modules/donations/useCases/setEmaiMessage/SetEmailMessageController";
import { SetNgoEmailController } from "../modules/donations/useCases/setNgoEmail/SetNgoEmailController";
import { UpdateDonationController } from "../modules/donations/useCases/updateDonation/UpdateDonationController";
import { UpdateNgoController } from "../modules/donations/useCases/updateNgo/UpdateNgoController";

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
const manageAllNgosController = new ManageAllNgosController()
const manageNgoController = new ManageNgoController()
const loadUpdateNgoController = new LoadUpdateNgoController()
const updateNgoController = new UpdateNgoController()
const deleteNgoController = new DeleteNgoController()
const loadNgoMessagesController = new LoadNgoMessagesController()
const loadNgoMessageController = new LoadNgoMessageController()
const deleteNgoMessageController = new DeleteNgoMessageController()

const loadUpdateDonationController = new LoadUpdateDonationController()
const updateDonationController = new UpdateDonationController()

//inicio//pagina inicial mostra todas as ongs
donationRoutes.get("/", ensureAuthenticated,  handleMessage, findAllNgosController.handle)


//fazer a view
donationRoutes.get("/instituicao/criar", ensureAdmin, handleMessage, loadCreateNgoController.handle)
donationRoutes.post("/instituicao/criar", ensureAdmin, upload.none(), createNgoController.handle)

//pagina da ong
donationRoutes.get("/instituicao/:id", handleMessage, getNgoController.handle)

//gerenciar instituiçao
donationRoutes.get("/gerenciar-instituicoes", ensureAuthenticated,  ensureAdmin,  handleMessage, manageAllNgosController.handle)
donationRoutes.get("/instituicao/:ngo_id/gerenciar", ensureAdmin,  handleMessage, manageNgoController.handle)
//atualizar ngo
donationRoutes.get("/instituicao/:ngo_id/atualizar", ensureAdmin,  handleMessage, loadUpdateNgoController.handle)
donationRoutes.put("/instituicao/:ngo_id/atualizar", ensureAdmin, upload.none(), updateNgoController.handle)
//del ngo
donationRoutes.delete("/instituicao/:ngo_id/deletar", ensureAdmin, upload.none(), deleteNgoController.handle)
//load msg
donationRoutes.get("/instituicao/:ngo_id/mensagens", ensureAdmin,  handleMessage, loadNgoMessagesController.handle)
donationRoutes.get("/instituicao/:ngo_id/mensagens/:message_id", ensureAdmin,  handleMessage, loadNgoMessageController.handle)
donationRoutes.delete("/instituicao/:ngo_id/mensagens/:message_id", ensureAdmin, upload.none(), deleteNgoMessageController.handle)


//gerar talao
donationRoutes.get("/instituicao/:ngo_id/gerar-talao", ensureAdmin, handleMessage, loadGenerateBookletController.handle)
donationRoutes.post("/instituicao/:ngo_id/gerar-talao", ensureAdmin, upload.none(), generateBookletController.handle)

//mostrar talao
donationRoutes.get("/instituicao/:ngo_id/talao/:year/:month/:file_name", ensureAdmin, handleMessage, loadBookletController.handle )

//altera numero contador de doação
donationRoutes.get("/instituicao/:ngo_id/contador/", ensureAdmin, handleMessage, loadDonationCounterPageController.handle)
donationRoutes.post("/instituicao/:ngo_id/contador/definir", ensureAdmin, upload.none(), setDonationCounterController.handle)

//criar nova doação
donationRoutes.get("/instituicao/:ngo_id/doacao/nova", handleMessage, loadCreateDonationController.handle )
donationRoutes.post("/instituicao/:ngo_id/doacao/nova", upload.none(), createDonationController.handle)//cria a donation

//listar
donationRoutes.get("/instituicao/:ngo_id/doacao/listar", ensureAdmin, handleMessage, listDonationsController.handle)

//importar
donationRoutes.get("/instituicao/:ngo_id/doacao/importar", ensureAdmin, handleMessage, loadImportDonationsController.handle)
donationRoutes.post("/instituicao/:ngo_id/doacao/importar", ensureAdmin, upload.single("file"), importDonationsController.handle)

//pegar doaçao
donationRoutes.get("/instituicao/:ngo_id/doacao/ultima", ensureAdmin, handleMessage, getDonationController.handle)
donationRoutes.get("/instituicao/:ngo_id/doacao/:donation_number", ensureAdmin, handleMessage, getDonationController.handle)

//atualizar doação
donationRoutes.get("/instituicao/:ngo_id/doacao/:donation_number/atualizar", ensureAdmin, handleMessage, loadUpdateDonationController.handle)
donationRoutes.put("/instituicao/:ngo_id/doacao/:donation_number/atualizar", ensureAdmin, upload.none(), updateDonationController.handle)

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