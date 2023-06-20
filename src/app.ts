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




import router from "./routes/index"

import { errorHandler } from "./shared/errors/errorHandler"
import { AppError } from "./shared/errors/AppError"

import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"

import rateLimiter from "./shared/middlewares/rateLimiter"

///*import WEB SOCKET */
import http from "http"
import * as socket from "socket.io"

const app = express()

///**CONFIG DO WEB SOCKET */
const httpServer = new http.Server(app)
const socketIO = new socket.Server(httpServer)
// const http = require("http").Server(app)

///////

//front
app.use(express.static("public"))

app.use(methodOverride('_method'));//front

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));//front 

 


nunjucks.configure("public", {
    express: app,
    autoescape: true,
    noCache: true
})
app.set("view engine", "njk")


//session redis
app.use(session(redisSession))

app.use(function(req, res, next) {
    if(!req.session){
       throw new AppError("Redis down!", 500)
    }
    next()
})


app.use(rateLimiter)


Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new Sentry.Integrations.Http({tracing: true}),

        new Tracing.Integrations.Express({app})
    ],

    tracesSampleRate: 1.0,
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())



//CONFIG DO SOCKET IO
socketIO.on("connection", (socket) => {
    
    console.log(`${socket.id} user just connected`);
    
    //como emitir o evento do email no email
    // socketIO.emit("response", {message: "this works", success: "sucesso"})
  
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // socket.on("message", (data) => {

    //     socket.emit("response", data)
    //     // socket.emitWithAck
    //     // socket.to para um room especifico(so com admins talvez?)
    // })

})

// app.set("socketio", socketIO)


//routes
app.use(router)

app.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error){

        let code = error.status || error.statusCode

        if(+(code) >= 400 && +(code) <= 600){

            return true
            
        }

        return false
    }
}))

//middleware de erro apos as rotas
app.use(errorHandler)


export {app, httpServer, socketIO}