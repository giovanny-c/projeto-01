import { ICreateDonorDTO } from "../dtos/ICreateDonorDTO"
import { IListDonorsDTO } from "../dtos/IListDonorsDTO"
import { Donor } from "../entities/donor"


interface IDonorsRepository {

    create(data: ICreateDonorDTO): Promise<Donor>
    findByEmail(email: string): Promise<Donor>
    findById(id: string): Promise<Donor>
    findBy(value: string): Promise<Donor[]>



}

export { IDonorsRepository }