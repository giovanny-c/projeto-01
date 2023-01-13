import { Router } from "express"
import { donationRoutes } from "./donation.routes"
import { donorRoutes } from "./donor.routes"
import { loginRoutes } from "./login.routes"
import { userRoutes } from "./user.routes"
import { workerRoutes } from "./worker.routes"



const router = Router()


router.use(loginRoutes)
router.use("/usuario", userRoutes)
router.use("/doador", donorRoutes)
router.use(donationRoutes)
router.use("/funcionarios", workerRoutes)

export default router