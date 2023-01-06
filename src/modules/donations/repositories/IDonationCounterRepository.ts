
import { IFindOptions } from "../dtos/IFindOptionsDTO"
import { DonationCounter } from "../entities/donation_counter"



interface IDonationCounterRepository {

    create(ngo_id: string, donation_number: number): Promise<DonationCounter>
    findById(id: string): Promise<DonationCounter>
    findByNgoId(ngo_id: string): Promise<DonationCounter>
    findAll(): Promise<DonationCounter[]>
    update(ngo_id: string, donation_number: number, last_donation_number: number): Promise<Partial<DonationCounter>>

}

export { IDonationCounterRepository }