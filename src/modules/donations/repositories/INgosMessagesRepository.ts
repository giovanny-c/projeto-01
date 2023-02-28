import { ICreateNgoMessage } from "../dtos/ICreateNgoMessageDTO";
import { NgoMessage } from "../entities/ngos_messages";

interface INgosMessagesRepository {

    create({id, ngo_id, message, subject}: ICreateNgoMessage): Promise<void>
    delete(id: string, ngo_id?: string): Promise<void>
    findById(id: string): Promise<NgoMessage>
    findByNgoId(ngo_id: string): Promise<NgoMessage[]>

}

export { INgosMessagesRepository}