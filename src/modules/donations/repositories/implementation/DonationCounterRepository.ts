import { Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { DonationCounter } from "../../entities/donation_counter";
import { IDonationCounterRepository } from "../IDonationCounterRepository";



class DonationCounterRepository implements IDonationCounterRepository{
    
    private repository: Repository<DonationCounter>

    constructor(){

        this.repository = dataSource.getRepository(DonationCounter)
    }

    
    async create(ngo_id: string, donation_number: number): Promise<void> {
        
        const donation_counter = this.repository.create({
            ngo_id,
            donation_number
        })
        
        await this.repository.save(donation_counter)
    }

    async findById(id: string): Promise<DonationCounter> {
        return this.repository.findOneBy({id})
    }
    async findByNgoId(ngo_id: string): Promise<DonationCounter> {
        return this.repository.findOneBy({ngo_id})
    }
    async findAll(): Promise<DonationCounter[]> {
        return this.repository.find()
    }
    async update(ngo_id: string, donation_number: number, last_donotion_number: number): Promise<Partial<DonationCounter>> {
        
        return await this.repository.createQueryBuilder()
        .update(DonationCounter)
        .set({donation_number, last_donotion_number})
        .where("ngo_id = :ngo_id", {ngo_id})
        .returning(["donation_number"])
        .execute() as Partial<DonationCounter>
        
 
    }

}

export {DonationCounterRepository}