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
fileRoutes.get("/file", ensureAuthenticated, ensureAdmin, handleMessage, streamFileController.handle)
fileRoutes.get("/file/generate/:file", ensureAuthenticated, ensureAdmin, handleMessage, generateFileController.handle)
fileRoutes.post("/file/generate/:file", ensureAuthenticated, ensureAdmin, handleMessage, generateFileController.handle)
fileRoutes.get("/file/donations", ensureAuthenticated, ensureAdmin, handleMessage, exportDonationsController.handle)

export {fileRoutes}