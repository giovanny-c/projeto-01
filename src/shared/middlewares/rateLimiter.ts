

import { RateLimiterRedis } from "rate-limiter-flexible"

import { Request, Response, NextFunction } from "express"

import { redisClient } from "../redis/redisConfig"
import { AppError } from "../errors/AppError"

const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rateLimiter",
    points: 20, //20 requests
    duration: 2 //per 2 seconds
})

export default async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    try{

        
        await limiter.consume(req.ip)

        return next()
    }catch(err){
        throw new AppError("Too many requests", 429)
    }finally{
       
    }
}