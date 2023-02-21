import { ICreateNgoEmail } from "../dtos/ICreateNgoEmailDTO";

interface INgosEmailsRepository {

    create({email, ngo_id, password, service, id}: ICreateNgoEmail): Promise<void>
    delete(id: string, ngo_id?: string): Promise<void>

}

export { INgosEmailsRepository}