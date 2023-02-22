import { ILike, Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { Ngo } from "../../entities/ngos";
import { INgoRepository } from "../INgoRepository";



class NgoRepository implements INgoRepository{

    private repository: Repository<Ngo>

    constructor(){

        this.repository = dataSource.getRepository(Ngo)
    }

    
    async create(name: string, full_name: string, alias: string, id?: string): Promise<Ngo> {

        const ngo = this.repository.create({
            id,
            name,
            full_name,
            alias,
        })
        
       return await this.repository.save(ngo)
    }
    async findById(id: string): Promise<Ngo> {
        return await this.repository.findOne({
            relations: {
                ngo_emails: true,
                ngo_messages: true
            },
            where:{id}
        })
    }
    async findByName(name: string): Promise<Ngo> {
        return await this.repository.findOneBy({name})
    }
    async findAll(): Promise<Ngo[]> {
        return  await this.repository.find()
    }
}

export {NgoRepository}