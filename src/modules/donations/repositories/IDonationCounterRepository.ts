
import { IFindOptions } from "../dtos/IFindOptionsDTO"
import { DonationCounter } from "../entities/donation_counter"



interface IDonationCounterRepository {

    create(ngo_id: string, donation_number: number): Promise<DonationCounter>
    findById(id: string): Promise<DonationCounter>
    findByNgoId(ngo_id: string): Promise<DonationCounter>
    findAll(): Promise<DonationCounter[]>
    update(ngo_id: string, new_donation_number: number, current_donation_number: number): Promise<Partial<DonationCounter>>
    delete(ngo_id: string)
}

export { IDonationCounterRepository }