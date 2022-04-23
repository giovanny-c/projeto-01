
import express from "express"

import { userRoutes } from "./routes/user.routes"

import "./database"

const app = express()

app.use(express.json())

app.use("/user", userRoutes)

app.listen(3333, () => console.log("Server is running on port 3333"))
