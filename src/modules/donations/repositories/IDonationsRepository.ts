import { Donation } from "../entities/donation"


interface IDonationsRepository {

    create(data: ICreateDonationsDTO): Promise<void>
    findBy(property: string, value: string): Promise<Donation[]>
    findOneBy(property: string, value: string): Promise<Donation>
    donationPayed(id: string): Promise<Donation>


}

export { IDonationsRepository }