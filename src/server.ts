import "reflect-metadata"

import express, { NextFunction, Request, Response } from "express"

import "express-async-errors"

import nunjucks from "nunjucks" //front
import methodOverride from "method-override"//front

import { userRoutes } from "./routes/user.routes"
import { donorRoutes } from "./routes/donor.routes"

import "./database"

import "./shared/container"
import { donationRoutes } from "./routes/donation.routes"
import { AppError } from "./shared/errors/AppError"
import { workerRoutes } from "./routes/worker.routes"

const app = express()



app.use(express.json())
app.use(express.urlencoded({ extended: true }));//front 
app.use(express.static('public'));//front
app.use(methodOverride('_method'));//front

app.use("/user", userRoutes)
app.use("/donors", donorRoutes)
app.use("/donations", donationRoutes)
app.use("/workers", workerRoutes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message })
    }

    return res.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })
})

//front
app.set("view engine", "njk")

nunjucks.configure("views", {
    express: app,
    autoescape: false,
    noCache: true
})


app.listen(3333, () => console.log("Server is running on port 3333"))
