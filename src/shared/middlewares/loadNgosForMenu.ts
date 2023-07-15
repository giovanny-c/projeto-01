import { array } from "joi";
import { Ngo } from "../../modules/donations/entities/ngos";
import { NgoRepository } from "../../modules/donations/repositories/implementation/NgoRepository";
import { RedisCacheProvider } from "../../shared/container/providers/cacheProvider/implementations/RedisCacheProvider";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";




export async function loadNgosForMenu(req: Request, res: Response, next: NextFunction) {
    
    

    const cacheProvider = container.resolve(RedisCacheProvider)
    const ngosRepository = container.resolve(NgoRepository)


    const ngos_ids = await cacheProvider.scan<string[]>("ngo-*", 100)
    let ngos

    if(!ngos_ids.length){

        ngos = await ngosRepository.findAll()

        ngos.forEach(async (ngo) => {

            await cacheProvider.set(`ngo-${ngo.id}`, JSON.stringify(ngo))
        
        
        })

    }
    

    if(!ngos){
        ngos = await cacheProvider.mGet<string[]>(ngos_ids)
    }

    
    ngos = ngos.map((ngo) => {
        
        const {id, name} = JSON.parse(ngo) as Ngo
        return {
            id,
            name
        }
    })
    
    
    
    //ordem alfabetica
    req.ngos = ngos.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1);

    

    

    next()


}