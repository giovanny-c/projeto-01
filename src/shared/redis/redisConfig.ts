
import * as redis from "redis"

import "dotenv/config"
//const Redis = require("ioredis")

//config redis client
const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        host: process.env.REDIS_HOST as string,
        port: +(process.env.REDIS_PORT),
        
    },
    // username: process.env.REDIS_USERNAME as string,
    password: process.env.REDIS_PASSWORD as string
    
})


export {redisClient}