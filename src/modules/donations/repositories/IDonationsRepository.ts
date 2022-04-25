import { Donation } from "../entities/donation"


interface IDonationsRepository {

    create(data: ICreateDonationsDTO): Promise<void>
    findBy(property: string, value: string): Promise<Donation[]>
    findOneById(id: string): Promise<Donation>
    MarkDonationAsPayed(donation: ICreateDonationsDTO, payed_at: Date): Promise<Donation>
    MarkDonationAsCanceled(id: string, confirmation: boolean): Promise<Donation>


}

export { IDonationsRepository }