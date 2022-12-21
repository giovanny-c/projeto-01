import { redisClient } from "@shared/redis/redisConfig"
import { promisify } from "util"
import ICacheProvider from "../ICacheProvider"

class RedisCacheProvider implements ICacheProvider{



    getRedis<T>(value: string): T | undefined { //transforma a func get do redis em async
        const syncRedisGet = promisify(redisClient.get).bind(redisClient)
        return syncRedisGet(value)
    }

    setRedis<T>(key: string, value: string): T | undefined{
        const syncRedisSet = promisify(redisClient.set).bind(redisClient)
        return syncRedisSet(key, value)
    }

    delRedis<T>(key: string): T | undefined{
        const syncRedisSet = promisify(redisClient.del).bind(redisClient)
        return syncRedisSet(key)
    }

    async addInCart<T>(item_id: string, user_id: string): Promise<T | undefined>{

        const getItem = promisify(redisClient.hGet).bind(redisClient)

        const itemExists = await getItem(`basket: ${user_id}`, item_id)

        
        if(!itemExists){

            
            const setItem =  promisify(redisClient.hSet).bind(redisClient)

            return await setItem(`basket: ${user_id}`, item_id, 1)
        }

        if(itemExists){
            const increaseItem = promisify(redisClient.hIncrBy).bind(redisClient)
            
            return await increaseItem(`basket: ${user_id}`, item_id, 1)
        }
    }

    async getCart<T>(user_id: string): Promise<T | undefined>{

        const getAll = promisify(redisClient.hGetAll).bind(redisClient)
        
        return await getAll(`basket: ${user_id}`)
    }

    async delInCart<T>(item_id: string, user_id: string): Promise<T | undefined>{

        const delCart = promisify(redisClient.hDel).bind(redisClient)
        
        return  await delCart(`basket: ${user_id}`, item_id)
    }

    async delCart<T>(user_id: string): Promise<T | undefined>{

        const delCart = promisify(redisClient.del).bind(redisClient)
        
        return  await delCart(`basket: ${user_id}`)
    }

    async decreaseInCart<T>(item_id: string, user_id: string): Promise<T | undefined>{


        const getItem = promisify(redisClient.hGet).bind(redisClient)

        const itemExists = await getItem(`basket: ${user_id}`, item_id)

        
    
        if(!itemExists){

            
            return undefined
        }

        if(itemExists){

            if(itemExists <= 1){

                const removeFromCart = promisify(redisClient.hDel).bind(redisClient)
            
                return await removeFromCart(`basket: ${user_id}`, item_id)         
            }
            
            const delInCart = promisify(redisClient.hIncrBy).bind(redisClient)
            
            return await delInCart(`basket: ${user_id}`, item_id, -1)

            

        }



    }
}

export {RedisCacheProvider}