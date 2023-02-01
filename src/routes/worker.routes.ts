
import { Router } from "express"
import multer from "multer"
import { CreateWorkerController } from "../modules/workers/useCases/createWorkerUseCase/CreateWorkerController"
import { GetWorkerController } from "../modules/workers/useCases/getWorker/GetWorkerController"
import { ListWorkersController } from "../modules/workers/useCases/listWorkers/ListWorkersController"
import { LoadCreateWorkerController } from "../modules/workers/useCases/loadCreateWorker/LoadCreateWorkerController"
import { UpdateWorkerController } from "../modules/workers/useCases/updateWorkers/UpdateWorkerController"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"

const upload = multer()

const workerRoutes = Router()

const createWorkerController = new CreateWorkerController()
const updateWorkerController = new UpdateWorkerController()
const listWorkersController = new ListWorkersController()
const getWorkerController = new GetWorkerController()
const loadCreateWorkerController = new LoadCreateWorkerController()

workerRoutes.get("/", ensureAuthenticated, listWorkersController.handle)

workerRoutes.get("/criar", ensureAuthenticated, loadCreateWorkerController.handle)
workerRoutes.post("/criar", ensureAuthenticated, upload.none(), createWorkerController.handle)

workerRoutes.get("/:worker_id", ensureAuthenticated, getWorkerController.handle)
workerRoutes.post("/:worker_id/update", ensureAuthenticated, updateWorkerController.handle)
//criar delete

export { workerRoutes }