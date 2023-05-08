import { container } from "tsyringe";
import { redisClient } from "../redis/redisConfig";
import { RedisCacheProvider } from "../container/providers/cacheProvider/implementations/RedisCacheProvider";




export async function limitSessions(req, res, next){
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // const cacheProvider = container.resolve(RedisCacheProvider)

    // const sessions = await cacheProvider.scan(0, {    
    //     match: "",
    //     type: "",
        
    // })

    
    const sessions = await redisClient.scan(0, {MATCH: "*", TYPE: "string", COUNT: 100 })
// :*:${ip}
    console.log(sessions)

    next()
}