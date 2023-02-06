
import { Router } from "express";

import multer from "multer";
import uploadConfig from "../config/upload"

import { CreateDonorController } from "../modules/donor/useCases/createDonor/CreateDonorController";
import { DeleteDonorController } from "../modules/donor/useCases/deleteDonor/DeleteDonorController";
import { GetDonorAndDonationsController } from "../modules/donor/useCases/GetDonoraAndDonations/GetDonorAndDonationsController";
import { ImportDonorsController } from "../modules/donor/useCases/importDonors/ImportDonorsController";
import { ListDonorsController } from "../modules/donor/useCases/listDonors/ListDonorsController";
import { LoadCreateDonorController } from "../modules/donor/useCases/loadCreateDonor/LoadCreateDonorController";
import { LoadDonorsHubController } from "../modules/donor/useCases/loadDonorsHub/LoadDonorsHubController";
import { LoadImportDonorController } from "../modules/donor/useCases/loadImportDonor/LoadImportDonorController";
import { LoadUpdateDonorController } from "../modules/donor/useCases/loadUpdateDonor/LoadUpdateDonorsController";
import { UpdateDonorController } from "../modules/donor/useCases/updateDonor/UpdateDonorController";
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated";

const upload = multer(uploadConfig)

const donorRoutes = Router()

const createDonorController = new CreateDonorController()
const listDonorController = new ListDonorsController()
const getDonorAndDonationsController = new GetDonorAndDonationsController()
const updateDonorController = new UpdateDonorController()
const loadDonorsHubController = new LoadDonorsHubController()
const loadCreateDonorController = new LoadCreateDonorController()
const loadImportDonorsController = new LoadImportDonorController()
const importDonorsController = new ImportDonorsController()
const loadUpdateDonorController = new LoadUpdateDonorController()
const deleteDonorController = new DeleteDonorController()

donorRoutes.get("/", ensureAuthenticated, loadDonorsHubController.handle)


donorRoutes.get("/criar", ensureAuthenticated, loadCreateDonorController.handle)
donorRoutes.post("/criar", ensureAuthenticated, upload.none(), createDonorController.handle)

donorRoutes.get("/importar", ensureAuthenticated, loadImportDonorsController.handle)
donorRoutes.post("/importar", ensureAuthenticated, upload.single("file"), importDonorsController.handle)

donorRoutes.get("/listar", ensureAuthenticated, listDonorController.handle)

donorRoutes.get("/:donor_id", ensureAuthenticated, getDonorAndDonationsController.handle)

donorRoutes.get("/:donor_id/editar", ensureAuthenticated, loadUpdateDonorController.handle)
donorRoutes.put("/:donor_id/editar", ensureAuthenticated, upload.none(), updateDonorController.handle)

donorRoutes.delete("/:donor_id/deletar", ensureAuthenticated, deleteDonorController.handle)

export { donorRoutes }

