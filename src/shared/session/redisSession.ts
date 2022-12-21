import { redisClient } from "@shared/redis/redisConfig";
import session from "express-session"
import connectRedis from "connect-redis"

let RedisStore = connectRedis(session)
const redisSession = {
    secret: process.env.SESSION_SECRET as string,
    store: new RedisStore({
        client: redisClient as any
    }),
    resave: true, //atualiza o cookie quando for feito um request pelo client
    rolling: true, //enquanto resave for true nao vai permitir que a sessao 'morra' se o use estiver ativo
    saveUninitialized: false, //se true salva sessoes vazias, de usuarios nao logados 
    
    cookie: {       
        //habilitar em produçao
        secure: false, //true: so transmite o cookie via https
        httpOnly: false, //true: nao deixa o cookie ser lido por client-side js
        maxAge: 1000 * 60 * 60 * 24 // 1d * 30,  //1 mes

    },

}


export { redisSession }