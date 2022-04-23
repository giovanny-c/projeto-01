import { ICreateDonorDTO } from "../dtos/ICreateDonorDTO"
import { Donor } from "../entities/donor"


interface IDonorsRepository {

    create(data: ICreateDonorDTO): Promise<void>
    findByEmail(email: string): Promise<Donor>
    findById(id: string): Promise<Donor>
    findAll(): Promise<Donor[]>


}

export { IDonorsRepository }