import { IFindOptions } from "../dtos/IFindOptionsDTO"
import { Donation } from "../entities/donation"



interface IDonationsRepository {

    create(data: ICreateDonationsDTO): Promise<void>
    findOneById(id: string): Promise<Donation>
    findDonationsByUserOrDonorId(id: string): Promise<Donation[]>
    findDonationsBy(data: IFindOptions): Promise<Donation[]>
    findDonationsForWorker(worker_id: string, data: IFindOptions): Promise<Donation[]>
    countDonationsValuesForWorker(worker_id: string, data: IFindOptions)
    //findByCreated_atOrPayed_at(data: Date, dateType: string(criado ou pago))
    // findByIsPayedOrIsCanceled (isTrue: boolean, payOrCanceled: string)
    MarkDonationAsPayed(donation: ICreateDonationsDTO, payed_at: Date): Promise<Donation>
    MarkDonationAsCanceled(id: string, confirmation: boolean): Promise<Donation>
}

export { IDonationsRepository }