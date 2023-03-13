import ICreateNgo from "../dtos/ICreateNgoDTO"
import { Ngo } from "../entities/ngos"




interface INgoRepository {

    create(data: ICreateNgo): Promise<Ngo>
    findById(id: string): Promise<Ngo>
    findByName(name: string): Promise<Ngo>
    findAll(): Promise<Ngo[]>
    delete(id: string)
    
}

export { INgoRepository }