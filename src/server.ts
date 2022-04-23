import "reflect-metadata"

import express from "express"

import { userRoutes } from "./routes/user.routes"
import { donorRoutes } from "./routes/donor.routes"

import "./database"

import "./shared/container"

const app = express()

app.use(express.json())

app.use("/user", userRoutes)
app.use("/donors", donorRoutes)

app.listen(3333, () => console.log("Server is running on port 3333"))
