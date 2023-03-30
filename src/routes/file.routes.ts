import { Router } from "express"
import { StreamFileController } from "../modules/loadFiles/useCases/streamFile/StreamFileController"



import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
import { handleMessage } from "../shared/middlewares/handleMessage"

const streamFileController = new StreamFileController()

const fileRoutes = Router()

fileRoutes.get("/file", ensureAuthenticated, handleMessage, streamFileController.handle)


export {fileRoutes}