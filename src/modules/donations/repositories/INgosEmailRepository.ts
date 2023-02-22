import { ICreateNgoEmail } from "../dtos/ICreateNgoEmailDTO";
import { NgoEmail } from "../entities/ngos_emails";

interface INgosEmailsRepository {

    create({email, ngo_id, password, service, id}: ICreateNgoEmail): Promise<NgoEmail>
    findAllfromNgo(ngo_id: string): Promise<NgoEmail[]>
    findByEmail(email: string): Promise<NgoEmail>
    delete(id: string, ngo_id?: string): Promise<void>

}

export { INgosEmailsRepository}