import { ICreateDonorDTO } from "../dtos/ICreateDonorDTO"
import { IListDonorsDTO } from "../dtos/IListDonorsDTO"
import { Donor } from "../entities/donor"


interface IDonorsRepository {

    create(data: ICreateDonorDTO): Promise<Donor>
    find(): Promise<Donor[]>
    findByEmail(email: string): Promise<Donor>
    findByName(name: string): Promise<Donor>
    findById(id: string): Promise<Donor>
    findBy(value: string, limit: number, offset: number, user_id?: string): Promise<Donor[]>
    delete(id:string)


}

export { IDonorsRepository }