import { Ngo } from "../entities/ngos"




interface INgoRepository {

    create(name): Promise<void>
    findById(id: string): Promise<Ngo>
    findByName(name: string): Promise<Ngo>
    findAll(): Promise<Ngo[]>
    
}

export { INgoRepository }