
import { Router } from "express"
import { CreateWorkerController } from "../modules/workers/useCases/createWorkerUseCase/CreateWorkerController"
import { ListWorkersController } from "../modules/workers/useCases/listWorkers/ListWorkersController"
import { UpdateWorkerController } from "../modules/workers/useCases/updateWorkers/UpdateWorkerController"
import { GetWorkerController } from "../modules/workers/useCases/workerContribuitions/WorkerContribuitionsController"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"



const workerRoutes = Router()

const createWorkerController = new CreateWorkerController()
const updateWorkerController = new UpdateWorkerController()
const listWorkersController = new ListWorkersController()
const getWorkerController = new GetWorkerController()

workerRoutes.get("/", ensureAuthenticated, listWorkersController.handle)
workerRoutes.post("/criar", ensureAuthenticated, createWorkerController.handle)
workerRoutes.get("/:worker_id", ensureAuthenticated, getWorkerController.handle)
workerRoutes.post("/:worker_id/update", ensureAuthenticated, updateWorkerController.handle)
//criar delete

export { workerRoutes }