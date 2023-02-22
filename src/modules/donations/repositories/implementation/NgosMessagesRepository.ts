

import { Repository } from "typeorm"
import { dataSource } from "../../../../database"
import { ICreateNgoMessage } from "../../dtos/ICreateNgoMessageDTO"
import { NgoMessage } from "../../entities/ngos_messages"
import { INgosMessagesRepository } from "../INgosMessagesRepository"


class NgosMessagesRepository implements INgosMessagesRepository {

    private repository: Repository<NgoMessage>

    constructor(){

        this.repository = dataSource.getRepository(NgoMessage)
    }

    async create({id, ngo_id, message, subject, start_date, end_date}: ICreateNgoMessage){

        const ngo_email = this.repository.create({
            id,
            ngo_id,
            message,
            subject,
            start_date,
            end_date
        })

        await this.repository.save(ngo_email)

    }
    

    async delete(id: string, ngo_id?: string){

        await this.repository.delete(id)
    }

}

export {NgosMessagesRepository}