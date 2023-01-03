import "reflect-metadata"

import express from "express"
import cors from "cors"

import "express-async-errors"

import nunjucks from "nunjucks" //front
import methodOverride from "method-override"//front

import "./database"

import "./shared/container" 

//redis e session
import "./shared/redis/redisConnect"
import session from "express-session"
import { redisSession } from "./shared/session/redisSession"

//import upload from "@config/upload"

import router from "../src/routes/index"

import { errorHandler } from "./shared/errors/errorHandler"
import { AppError } from "./shared/errors/AppError"

const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));//front 


//front
app.use(methodOverride('_method'));//front

nunjucks.configure("views", {
    express: app,
    autoescape: true,
    noCache: true
})

app.set("view engine", ".njk")
app.use(express.static("../public"))


//session redis
app.use(session(redisSession))
app.use(function(req, res, next) {
    if(!req.session){
        return next( new AppError("Redis down!"))
    }
    next()
})

//routes
app.use(router)

//middleware de erro apos as rotas
app.use(errorHandler)


app.listen(3333, () => console.log("Server is running on port 3333"))
