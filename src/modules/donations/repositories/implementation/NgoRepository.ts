import { Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { Ngo } from "../../entities/ngos";
import { INgoRepository } from "../INgoRepository";



class NgoRepository implements INgoRepository{

    private repository: Repository<Ngo>

    constructor(){

        this.repository = dataSource.getRepository(Ngo)
    }

    
    async create(name: string, full_name): Promise<Ngo> {

        const ngo = this.repository.create({
            name,
            full_name,
        })
        
       return await this.repository.save(ngo)
    }
    async findById(id: string): Promise<Ngo> {
        return this.repository.findOneBy({id})
    }
    async findByName(name: string): Promise<Ngo> {
        return this.repository.findOneBy({name})
    }
    async findAll(): Promise<Ngo[]> {
        return this.repository.find()
    }
}

export {NgoRepository}