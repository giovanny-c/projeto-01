import { ICreateDonationsDTO } from "../dtos/ICreateDonationsDTO"
import { IFindOptions } from "../dtos/IFindOptionsDTO"
import IUpdateDonation from "../dtos/IUpdateDonationDTO"
import { Donation } from "../entities/donation"

interface ICountDonationsValueResponse{
    donations: Donation[]
    sum: number
    count: number
}

interface IDonationsRepository {

    create(data: ICreateDonationsDTO): Promise<Donation>
    update({id, donation_value, donor_name, worker_id, is_donation_canceled}: IUpdateDonation): Promise<void>
    findOneById(id: string): Promise<Donation>
    findDonationsByDonorId(id: string): Promise<Donation[]>
    findDonationsBy(data: IFindOptions): Promise<Donation[]>
    findDonationsByDate({ngo_id, startDate, endDate, orderBy}: IFindOptions): Promise<Donation[]>
    findDonationsByWorker(worker_id: string, data: IFindOptions): Promise<Donation[]>
    findForGenerateBooklet({donation_number_interval, ngo_id}:IFindOptions): Promise<Donation[]>
    findDonationByNumberAndNgoId({donation_number, ngo_id}: IFindOptions): Promise<Donation>
    countDonationsValues(data: IFindOptions): Promise<ICountDonationsValueResponse> 
    // markDonationAsPayed(donation: ICreateDonationsDTO, payed_at: Date): Promise<Donation>
    markDonationAsCanceled(id: string): Promise<Donation>
    markEmailSentForDonation(id: string): Promise<Donation>
    markMessageSentForDonation(id: string): Promise<Donation>
}

export { IDonationsRepository, ICountDonationsValueResponse }