import { Router } from "express"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
import { donationRoutes } from "./donation.routes"
import { donorRoutes } from "./donor.routes"
import { fileRoutes } from "./file.routes"
import { loginRoutes } from "./login.routes"
import { userRoutes } from "./user.routes"
import { workerRoutes } from "./worker.routes"
import { limitSessions } from "../shared/middlewares/limitSessions"
import { loadNgosForMenu } from "../shared/middlewares/loadNgosForMenu"



const router = Router()

// router.use(limitSessions)

router.use(["/usuarios", "/doadores", "/funcionarios", "/instituicao"], ensureAuthenticated)

router.use(loadNgosForMenu)

router.use(fileRoutes)
router.use(loginRoutes)
router.use("/usuarios", userRoutes)
router.use("/doadores", donorRoutes)
router.use(donationRoutes)
router.use("/funcionarios", workerRoutes)

export default router