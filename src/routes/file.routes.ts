import { Router } from "express"
import { StreamFileController } from "../modules/loadFiles/useCases/streamFile/StreamFileController"



import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
import { handleMessage } from "../shared/middlewares/handleMessage"
import { ensureAdmin } from "../shared/middlewares/ensureAdmin"
import { GenerateFileController } from "../modules/loadFiles/useCases/generateFile/GenerateFileController"
import { ExportDonationsController } from "../modules/donations/useCases/exportDonations/ExportDonationsController"


const streamFileController = new StreamFileController()
const generateFileController = new GenerateFileController()
const exportDonationsController = new ExportDonationsController()

const fileRoutes = Router()

//testat sem handleMessage
//stream de files do tmp ou examples
fileRoutes.get("/file", ensureAuthenticated, ensureAdmin, handleMessage, streamFileController.handle)

//gera o recibo
fileRoutes.get("/file/generate/:file", ensureAuthenticated, ensureAdmin, handleMessage, generateFileController.handle)

//gera o talao
fileRoutes.post("/file/generate/:file", ensureAuthenticated, ensureAdmin, handleMessage, generateFileController.handle)

//gera o export de doaçoes em xlsx.
fileRoutes.post("/instituicao/:ngo_id/doacao/exportar", ensureAuthenticated, ensureAdmin, handleMessage, exportDonationsController.handle)

export {fileRoutes}