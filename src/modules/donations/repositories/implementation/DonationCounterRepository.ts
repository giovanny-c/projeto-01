import { Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { IFindOptions } from "../../dtos/IFindOptionsDTO";
import { DonationCounter } from "../../entities/donation_counter";
import { IDonationCounterRepository } from "../IDonationCounterRepository";



class DonationCounterRepository implements IDonationCounterRepository{
    
    private repository: Repository<DonationCounter>

    constructor(){

        this.repository = dataSource.getRepository(DonationCounter)
    }
    

    
    async create(ngo_id: string, donation_number: number, id?: string): Promise<DonationCounter> {
        
        const donation_counter = this.repository.create({
            id,
            ngo_id,
            donation_number
        })
        
        return await this.repository.save(donation_counter)
    }

    async findById(id: string): Promise<DonationCounter> {
        return  await this.repository.findOneBy({id})
    }

    async findByNgoId(ngo_id: string): Promise<DonationCounter> {
        return  await this.repository.findOneBy({ngo_id})
    }
    async findAll(): Promise<DonationCounter[]> {
        return await this.repository.find()
    }
    async update(ngo_id: string, new_donation_number: number, current_donation_number: number): Promise<Partial<DonationCounter>> {
        
        return await this.repository.createQueryBuilder()
        .update(DonationCounter)
        .set({
            donation_number: new_donation_number, 
            last_donation_number: current_donation_number
        })
        .where("ngo_id = :ngo_id", {ngo_id})
        .returning(["donation_number"])
        .execute() as Partial<DonationCounter>
        
 
    }

    async delete(id: string){
        return await this.repository.delete({id})
    }

}

export {DonationCounterRepository}