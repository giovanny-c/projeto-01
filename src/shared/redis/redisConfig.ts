
import * as redis from "redis"


//const Redis = require("ioredis")

//config redis client
const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: process.env.REDIS_HOST as string,
        port: Number(process.env.REDIS_PORT),
        
        
    },
    //password:
    
})


export {redisClient}