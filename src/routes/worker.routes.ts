
import { Router } from "express"
import { CreateWorkerController } from "../modules/workers/useCases/createWorkerUseCase/CreateWorkerController"
import { ListWorkersController } from "../modules/workers/useCases/listWorkers/ListWorkersController"
import { UpdateWorkerController } from "../modules/workers/useCases/updateWorkers/UpdateWorkerController"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"



const workerRoutes = Router()

const createWorkerController = new CreateWorkerController()
const updateWorkerController = new UpdateWorkerController()
const listWorkersController = new ListWorkersController()

workerRoutes.post("/", ensureAuthenticated, createWorkerController.handle)

workerRoutes.get("/list", ensureAuthenticated, listWorkersController.handle)

workerRoutes.post("/:id/update", ensureAuthenticated, updateWorkerController.handle)


export { workerRoutes }