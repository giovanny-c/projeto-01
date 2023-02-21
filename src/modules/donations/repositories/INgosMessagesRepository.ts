import { ICreateNgoMessage } from "../dtos/ICreateNgoMessageDTO";

interface INgosMessagesRepository {

    create({id, ngo_id, message, subject, start_date, end_date}: ICreateNgoMessage): Promise<void>
    delete(id: string, ngo_id?: string): Promise<void>

}

export { INgosMessagesRepository}