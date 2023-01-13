import { Ngo } from "../entities/ngos"




interface INgoRepository {

    create(name: string, full_name: string, alias): Promise<Ngo>
    findById(id: string): Promise<Ngo>
    findByName(name: string): Promise<Ngo>
    findAll(): Promise<Ngo[]>
    
}

export { INgoRepository }