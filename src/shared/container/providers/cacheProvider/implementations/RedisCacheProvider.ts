
import { redisClient } from "../../../../redis/redisConfig"
import { promisify } from "util"
import ICacheProvider from "../ICacheProvider"

class RedisCacheProvider implements ICacheProvider{



    async get<T>(value: string): Promise<T | undefined> { //transforma a func get do redis em async
        const syncRedisGet = promisify(redisClient.get).bind(redisClient)
        
        return syncRedisGet(value)
    }

    async set<T>(key: string, value: string): Promise<T | undefined>{
        const syncRedisSet = promisify(redisClient.set).bind(redisClient)
        
        return syncRedisSet(key, value)
    }

    async delete<T>(key: string): Promise<T | undefined>{
        const syncRedisDel = promisify(redisClient.del).bind(redisClient)
        
        return syncRedisDel(key)
    }


    //poe no começo do array //    ou so um
    async pushToArray<T>(key: string, ...value: string[]): Promise<T | undefined>{
        const syncRedisLPush = promisify(redisClient.lPush).bind(redisClient)
        
        return syncRedisLPush(key, value)
    }


    async deleteFromArray<T>(key: string, index: number): Promise<T | undefined>{
        const syncRedisLIndex = promisify(redisClient.lIndex).bind(redisClient)
        
        const itemToRemove = syncRedisLIndex(key, index)

        const syncRedisLRem = promisify(redisClient.lRem).bind(redisClient)

        return syncRedisLRem(key, 0, itemToRemove)
    }
    

    //retorna os valors
    async getArray<T>(key: string): Promise<T | undefined>{
        const syncRedisLRange = promisify(redisClient.lRange).bind(redisClient)
        
        return syncRedisLRange(key, 0, -1)
    }
    

    // async scan<T>(cursor: number, options: {type: string | Buffer, match: string}): Promise<T | undefined> {

    //     const syncRedisScan = promisify(redisClient.scan).bind(redisClient)

    //     return syncRedisScan(cursor, options)
    // }
    // async get<T>(value: string): Promise<T | undefined> { //transforma a func get do redis em async
    //     const syncRedisGet = promisify(redisClient.get).bind(redisClient)
        
    //     return syncRedisGet(value)
    // }

    

    //talvez aproveite algo depois 
    // poe no redis e incrementa 1
    // async addInCart<T>(item_id: string, user_id: string): Promise<T | undefined>{

    //     const getItem = promisify(redisClient.hGet).bind(redisClient)

    //     const itemExists = await getItem(`basket: ${user_id}`, item_id)

        
    //     if(!itemExists){

            
    //         const setItem =  promisify(redisClient.hSet).bind(redisClient)

    //         return await setItem(`basket: ${user_id}`, item_id, 1)
    //     }

    //     if(itemExists){
    //         const increaseItem = promisify(redisClient.hIncrBy).bind(redisClient)
            
    //         return await increaseItem(`basket: ${user_id}`, item_id, 1)
    //     }
    // }

    // async getCart<T>(user_id: string): Promise<T | undefined>{

    //     const getAll = promisify(redisClient.hGetAll).bind(redisClient)
        
    //     return await getAll(`basket: ${user_id}`)
    // }

    // async delInCart<T>(item_id: string, user_id: string): Promise<T | undefined>{

    //     const delCart = promisify(redisClient.hDel).bind(redisClient)
        
    //     return  await delCart(`basket: ${user_id}`, item_id)
    // }

    // async delCart<T>(user_id: string): Promise<T | undefined>{

    //     const delCart = promisify(redisClient.del).bind(redisClient)
        
    //     return  await delCart(`basket: ${user_id}`)
    // }

    // async decreaseInCart<T>(item_id: string, user_id: string): Promise<T | undefined>{


    //     const getItem = promisify(redisClient.hGet).bind(redisClient)

    //     const itemExists = await getItem(`basket: ${user_id}`, item_id)

        
    
    //     if(!itemExists){

            
    //         return undefined
    //     }

    //     if(itemExists){

    //         if(itemExists <= 1){

    //             const removeFromCart = promisify(redisClient.hDel).bind(redisClient)
            
    //             return await removeFromCart(`basket: ${user_id}`, item_id)         
    //         }
            
    //         const delInCart = promisify(redisClient.hIncrBy).bind(redisClient)
            
    //         return await delInCart(`basket: ${user_id}`, item_id, -1)

            

    //     }



    //}
}

export {RedisCacheProvider}