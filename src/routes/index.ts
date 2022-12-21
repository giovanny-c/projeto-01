import { Router } from "express"
import { donationRoutes } from "./donation.routes"
import { donorRoutes } from "./donor.routes"
import { userRoutes } from "./user.routes"
import { workerRoutes } from "./worker.routes"

const router = Router()


router.use("/user", userRoutes)
router.use("/donors", donorRoutes)
router.use("/donations", donationRoutes)
router.use("/workers", workerRoutes)

export default router