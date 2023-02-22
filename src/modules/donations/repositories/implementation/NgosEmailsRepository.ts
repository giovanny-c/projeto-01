import { Repository } from "typeorm"
import { dataSource } from "../../../../database"
import { ICreateNgoEmail } from "../../dtos/ICreateNgoEmailDTO"
import { NgoEmail } from "../../entities/ngos_emails"
import { INgosEmailsRepository } from "../INgosEmailRepository"


class NgosEmailsRepository implements INgosEmailsRepository {

    private repository: Repository<NgoEmail>

    constructor(){

        this.repository = dataSource.getRepository(NgoEmail)
    }

    async create({email, ngo_id, password, service, id}: ICreateNgoEmail){

        const ngo_email = this.repository.create({
            id,
            email, 
            ngo_id,
            password, 
            service
        })

        return await this.repository.save(ngo_email)

    }

    async findAllfromNgo(ngo_id: string){

        return await this.repository.findBy({ngo_id})

    }

    async findByEmail(email: string){

        return await this.repository.findOneBy({email})
    }

    async delete(id: string, ngo_id?: string){

        await this.repository.delete(id)
    }

}

export {NgosEmailsRepository}