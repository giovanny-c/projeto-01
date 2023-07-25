import "dotenv/config"
import { redisClient } from "../redis/redisConfig";
import connectRedis from "connect-redis"

import session from "express-session"

import { Socket } from "socket.io";
import { NextFunction } from "express";

let RedisStore = connectRedis(session)

const redisSession = session({
    secret: process.env.SESSION_SECRET as string,
    store: new RedisStore({
        client: redisClient
    }),
    resave: true, //atualiza o cookie quando for feito um request pelo client
    rolling: true, //enquanto resave for true nao vai permitir que a sessao 'morra' se o use estiver ativo
    saveUninitialized: false, //se true salva sessoes vazias, de usuarios nao logados 
    
    cookie: {       
        //habilitar em produçao
        secure: false, //true: so transmite o cookie via https (so se for https)
        httpOnly: true, //true: nao deixa o cookie ser lido por client-side js
        maxAge: 1000 * 60 * 60 * 24 * 30,  //1 mes 
        //diminuir para 1 ou menos dia em produção

    },

})

const wrapSessionForSocketIo = expressMiddleware => (socket: Socket, next: NextFunction) => expressMiddleware(socket.request, {}, next)



export { redisSession, wrapSessionForSocketIo }