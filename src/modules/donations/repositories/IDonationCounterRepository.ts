
import { DonationCounter } from "../entities/donation_counter"



interface IDonationCounterRepository {

    create(ngo_id: string, donation_number: number): Promise<void>
    findById(id: string): Promise<DonationCounter>
    findByNgoId(ngo_id: string): Promise<DonationCounter>
    findAll(): Promise<DonationCounter[]>
    update(ngo_id: string, donation_number: number, last_donotion_number: number): Promise<void>
}

export { IDonationCounterRepository }