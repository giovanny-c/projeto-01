import ICreateNgo from "../dtos/ICreateNgoDTO"
import IUpdateNgoTemplate from "../dtos/IUpdateNgoTemplateDTO"
import { Ngo } from "../entities/ngos"




interface INgoRepository {

    create(data: ICreateNgo): Promise<Ngo>
    findById(id: string): Promise<Ngo>
    findByName(name: string): Promise<Ngo>
    findAll(): Promise<Ngo[]>
    delete(id: string): Promise<void>
    updateTemplate(data: IUpdateNgoTemplate): Promise<void>
    
}

export { INgoRepository }