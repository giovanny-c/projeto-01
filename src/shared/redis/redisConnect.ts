import { redisClient } from "./redisConfig"


redisClient.on("error", (err) => {
    console.error(`Could not establish a connection with redis.`, err)
})
redisClient.on("connect", (err) => {
    console.log("Connected to redis!")
})



redisClient.connect()
