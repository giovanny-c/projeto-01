import "reflect-metadata"

import express, { response } from "express"
import cors from "cors"

import "express-async-errors"

import nunjucks from "nunjucks" //front
import methodOverride from "method-override"//front

import "./database"

import "./shared/container" 

//redis e session
import "./shared/redis/redisConnect"
import session from "express-session"
import { redisSession, wrapSessionForSocketIo } from "./shared/session/redisSession"

//import upload from "@config/upload"




import router from "./routes/index"

import { errorHandler } from "./shared/errors/errorHandler"
import { AppError } from "./shared/errors/AppError"

import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"

import rateLimiter from "./shared/middlewares/rateLimiter"

///*import WEB SOCKET */
import {createServer} from "http"
import socketio, {Socket} from "socket.io"

 

const app = express()

///**CONFIG DO WEB SOCKET */
const httpServer = createServer(app)
const socketHandler = new socketio.Server(httpServer)
//////





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
app.use(redisSession)

// app.use(function(req, res, next) {
//     if(!req.session){
//        throw new AppError("Redis down!", 500)
//     }
//     next()
// })

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


//web socket handler
//sharing session with socket.io
socketHandler.use(wrapSessionForSocketIo(redisSession))
//por a sessao com redis amannah
socketHandler.on("connection", (socket: Socket) => {
    
    //@ts-expect-error
    const room = socket.request.session.user?.id || ""

    socket.join(room)
    
 
})

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


export {app, httpServer, socketHandler}