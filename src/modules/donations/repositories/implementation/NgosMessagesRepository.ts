

import { In, Repository } from "typeorm"
import { dataSource } from "../../../../database"
import { ICreateNgoMessage } from "../../dtos/ICreateNgoMessageDTO"
import { NgoMessage } from "../../entities/ngos_messages"
import { INgosMessagesRepository } from "../INgosMessagesRepository"


class NgosMessagesRepository implements INgosMessagesRepository {

    private repository: Repository<NgoMessage>

    constructor(){

        this.repository = dataSource.getRepository(NgoMessage)
    }

    async create({id, ngo_id, name, message, subject}: ICreateNgoMessage){

        const ngo_email = this.repository.create({
            id,
            ngo_id,
            name,
            message,
            subject,
            // start_date,
            // end_date
        })

        await this.repository.save(ngo_email)

    }

    async findById(id: string){
        return await this.repository.findOneBy({id}) 
    }

    async findByNgoId(ngo_id: string){
        return await this.repository.findBy({ngo_id}) 
    }
    

    async delete(id: string, ngo_id?: string){

        await this.repository.delete(id)
    }

    // async findMessageByDate(date_now: Date){

    //    await this.repository.createQueryBuilder("message")
    //    .select("message.*")
    //    .where("message.start_date <= :date_now ", {date_now})
    //    .andWhere("message.end_date => :date_now ", {date_now})
    //    .getMany()
       

    // }

}

export {NgosMessagesRepository}