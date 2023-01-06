import { ICreateDonationsDTO } from "../dtos/ICreateDonationsDTO"
import { IFindOptions } from "../dtos/IFindOptionsDTO"
import { Donation } from "../entities/donation"



interface IDonationsRepository {

    create(data: ICreateDonationsDTO): Promise<Donation>
    findOneById(id: string): Promise<Donation>
    findDonationsByDonorId(id: string): Promise<Donation[]>
    findDonationsBy(data: IFindOptions): Promise<Donation[]>
    findDonationsByWorker(worker_id: string, data: IFindOptions): Promise<Donation[]>
    countDonationsValues(worker_id: string, data: IFindOptions)
    findForGenerateBead({donationNumberInterval, orderBy, ngo_id}:IFindOptions)

    //findByCreated_atOrPayed_at(data: Date, dateType: string(criado ou pago))
    // findByIsPayedOrIsCanceled (isTrue: boolean, payOrCanceled: string)
    MarkDonationAsPayed(donation: ICreateDonationsDTO, payed_at: Date): Promise<Donation>
    MarkDonationAsCanceled(id: string, confirmation: boolean): Promise<Donation>
}

export { IDonationsRepository }