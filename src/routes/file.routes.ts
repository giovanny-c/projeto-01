import { Router } from "express"
import { StreamFileController } from "../modules/loadFiles/useCases/streamFile/StreamFileController"



import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
import { handleMessage } from "../shared/middlewares/handleMessage"
import { ensureAdmin } from "../shared/middlewares/ensureAdmin"

const streamFileController = new StreamFileController()

const fileRoutes = Router()

fileRoutes.get("/file", ensureAuthenticated, ensureAdmin, handleMessage, streamFileController.handle)
// fileRoutes.post("/file/generate/:file", ensureAuthenticated, ensureAdmin, handleMessage, generateFileController.handle)

export {fileRoutes}