import { ICreateDonationsDTO } from "../dtos/ICreateDonationsDTO"
import { IFindOptions } from "../dtos/IFindOptionsDTO"
import { Donation } from "../entities/donation"



interface IDonationsRepository {

    create(data: ICreateDonationsDTO): Promise<Donation>
    findOneById(id: string): Promise<Donation>
    findDonationsByDonorId(id: string): Promise<Donation[]>
    findDonationsBy(data: IFindOptions): Promise<[Donation[], number]>
    findDonationsByWorker(worker_id: string, data: IFindOptions): Promise<Donation[]>
    findForGenerateBooklet({donation_number_interval, ngo_id}:IFindOptions): Promise<Donation[]>
    findDonationByNumberAndNgoId({donation_number, ngo_id}: IFindOptions): Promise<Donation>

    countDonationsValues(worker_id: string, data: IFindOptions): Promise<[Donation[], number]>
   

    //findByCreated_atOrPayed_at(data: Date, dateType: string(criado ou pago))
    // findByIsPayedOrIsCanceled (isTrue: boolean, payOrCanceled: string)
    MarkDonationAsPayed(donation: ICreateDonationsDTO, payed_at: Date): Promise<Donation>
    MarkDonationAsCanceled(id: string): Promise<Donation>
}

export { IDonationsRepository }