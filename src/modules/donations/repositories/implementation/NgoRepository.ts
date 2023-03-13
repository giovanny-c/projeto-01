import { ILike, Repository } from "typeorm";
import { dataSource } from "../../../../database";
import ICreateNgo from "../../dtos/ICreateNgoDTO";
import { Ngo } from "../../entities/ngos";
import { INgoRepository } from "../INgoRepository";



class NgoRepository implements INgoRepository{

    private repository: Repository<Ngo>

    constructor(){

        this.repository = dataSource.getRepository(Ngo)
    }

    
    async create({alias, full_name, name, id}: ICreateNgo): Promise<Ngo> {

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

    async delete(id: string){
        return await this.repository.delete(id)
    }
}

export {NgoRepository}