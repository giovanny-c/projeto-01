
import { Router } from "express"
import multer from "multer"
import { CreateWorkerController } from "../modules/workers/useCases/createWorkerUseCase/CreateWorkerController"
import { DeleteWorkerController } from "../modules/workers/useCases/deleteWorker/DeleteWorkerController"
import { GetWorkerController } from "../modules/workers/useCases/getWorker/GetWorkerController"
import { ListWorkersController } from "../modules/workers/useCases/listWorkers/ListWorkersController"
import { LoadCreateWorkerController } from "../modules/workers/useCases/loadCreateWorker/LoadCreateWorkerController"
import { LoadUpdateWorkerController } from "../modules/workers/useCases/loadUpdateWorker/LoadUpdateWorkerController"
import { LoadUpdateWorkerUseCase } from "../modules/workers/useCases/loadUpdateWorker/LoadUpdateWorkerUseCase"
import { UpdateWorkerController } from "../modules/workers/useCases/updateWorkers/UpdateWorkerController"
import { ensureAdmin } from "../shared/middlewares/ensureAdmin"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
import { handleMessage } from "../shared/middlewares/handleMessage"



const upload = multer()

const workerRoutes = Router()

const createWorkerController = new CreateWorkerController()
const updateWorkerController = new UpdateWorkerController()
const listWorkersController = new ListWorkersController()
const getWorkerController = new GetWorkerController()
const loadCreateWorkerController = new LoadCreateWorkerController()
const loadUpdateWorkerController = new LoadUpdateWorkerController()
const deleteWorkerController = new DeleteWorkerController()

workerRoutes.use(ensureAdmin)

workerRoutes.get("/", handleMessage, listWorkersController.handle)

workerRoutes.get("/criar", handleMessage, loadCreateWorkerController.handle)
workerRoutes.post("/criar", upload.none(), createWorkerController.handle)

workerRoutes.get("/:worker_id", handleMessage, getWorkerController.handle)

workerRoutes.get("/:worker_id/atualizar", handleMessage, loadUpdateWorkerController.handle)
workerRoutes.put("/:worker_id/atualizar", upload.none(), updateWorkerController.handle)
//criar delete
workerRoutes.delete("/:worker_id/deletar", deleteWorkerController.handle)

export { workerRoutes }