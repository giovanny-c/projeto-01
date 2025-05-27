import { query } from "express";
import { Between, FindOptionsOrderValue, ILike, QueryBuilder, Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { Donor } from "../../../donor/entities/donor";
import { ICreateDonationsDTO } from "../../dtos/ICreateDonationsDTO";
import { IFindOptions } from "../../dtos/IFindOptionsDTO";
import IUpdateDonation from "../../dtos/IUpdateDonationDTO";
import { Donation } from "../../entities/donation";
import { ICountDonationsValueResponse, IDonationsRepository } from "../IDonationsRepository";



class DonationsRepository implements IDonationsRepository {

    private repository: Repository<Donation>

    constructor() {

        this.repository = dataSource.getRepository(Donation)
    }
    
    
    
    async create({id, user_id, donor_id, donor_name, ngo_id ,donation_value, is_payed, payed_at, donation_number, created_at, is_donation_canceled, worker_id }: ICreateDonationsDTO): Promise<Donation> {

        const donation = this.repository.create({
           id,
           donor_id,
           donor_name,
           user_id,
           worker_id,
           ngo_id,
           donation_number,
           donation_value,
           created_at,
           is_payed,
           payed_at,
           is_donation_canceled,
        })
        
        
        return await this.repository.save(donation)
        
        
    }
    
    async update({id, donation_value, donor_name, worker_id, is_donation_canceled, created_at}: IUpdateDonation){
        
        await this.repository.update({id},{
            donation_value,
            donor_name,
            worker_id,
            created_at,
            is_donation_canceled,
        })
        
        
    }
    
    async countDonationsValues({startDate, endDate, ngo_id, worker_id, limit, offset, orderBy }: IFindOptions): Promise<ICountDonationsValueResponse> {
        
        const sum = this.repository.createQueryBuilder("donations")
        .select("SUM(donations.donation_value)", "total_value")
        .addSelect("COUNT(donations)", "total")
        .where("donations.is_donation_canceled IS NOT true")
        .andWhere("donations.ngo_id = :ngo_id", {ngo_id})
        .andWhere("donations.created_at between :startDate and :endDate ", {startDate, endDate})
        
        
        let query = this.repository.createQueryBuilder("donations")
        .leftJoinAndSelect("donations.worker", "workers")
        .leftJoinAndSelect("donations.ngo", "ngos")
        .leftJoinAndSelect("donations.donor", "donors")
        .where("donations.is_donation_canceled IS NOT true")
        .andWhere("donations.ngo_id = :ngo_id", {ngo_id})
        .andWhere("donations.created_at between :startDate and :endDate ", {startDate, endDate})
        
        if(worker_id){
            query.andWhere("donations.worker_id = :worker_id", {worker_id})
            sum.andWhere("donations.worker_id = :worker_id", {worker_id})
            
        }
        
        query.skip(offset).take(limit)
        
        query.orderBy("donations.donation_number", orderBy)
        
        
        // query.groupBy("donations.id, workers.id, ngos.id, donors.id")
        
        const {total, total_value} = await sum.getRawOne()
        const queryResults = await query.getMany()
        
        return {
            donations: queryResults,
            sum: +(total_value),
            count: total
        }
    }
  
   
    
    async findForGenerateBooklet({ donation_number_interval, ngo_id }: IFindOptions): Promise<Donation[]> {
        
        let query = await this.repository.createQueryBuilder("donations")
        .leftJoinAndSelect("donations.worker", "workers")
        .leftJoinAndSelect("donations.donor", "donors")
        .leftJoinAndSelect("donations.ngo", "ngos")
        .select(["donations","workers","donors","ngos"])
        .where("donations.ngo_id = :ngo_id", {ngo_id})
        .andWhere("donations.donation_number BETWEEN :first AND :last ", {first: donation_number_interval[0], last: donation_number_interval[1]})
        .orderBy("donations.donation_number", "ASC")
        .getMany()
    

        return query

    }

    //REFAZER COM QUERY BUILDER
    async findDonationsBy({ value, ngo_id, orderBy, limit, offset, startDate, endDate, donor_name, worker_id, donation_number, not_email }: IFindOptions): Promise<Donation[]> {
        // buscar tbm por is payed or is_canceled
        let query = this.repository.createQueryBuilder("donations")
        .leftJoinAndSelect("donations.worker", "workers")
        .leftJoinAndSelect("donations.donor", "donors")
        .leftJoinAndSelect("donations.ngo", "ngos")
        .select(["donations","workers","donors","ngos"])
        .where("donations.ngo_id = :ngo_id ", {ngo_id})

        if(startDate && endDate){
            query.andWhere("donations.created_at between :startDate and :endDate ", {startDate, endDate})
        }

        if(donor_name){
            query.andWhere("donations.donor_name ilike :donor_name ", {donor_name: `%${donor_name}%`})
        }

        if(donation_number){
            query.andWhere("donations.donation_number = :donation_number ", {donation_number})
        }
        
        if(worker_id){
            query.andWhere("workers.id = :worker_id ", {worker_id})
        }
        
        if(not_email){
            query.andWhere("donations.is_email_sent = :not_email ", {not_email: false})
        }

        if(orderBy){
            query.orderBy("donations.donation_number", orderBy)
        }



        if(limit){
            query.limit(limit)
        }
        if(offset){
            query.offset(offset)
        }


        
        const results = await query.getMany()

      
        return results
        

        // `select donations.*, 
        // donors.name as donor, 
        // workers.name as worker 
        // from donations
        // left join donors on donations.donor_id = donors.id
        // left join workers on donations.worker_id = workers.id
        // where donors.name ilike '%an%' and donations.created_at between '2022-04-24' and '2022-05-30'
        // or
        // workers.name ilike '%an%' and donations.created_at between '2022-04-24' and '2022-05-30'
        // order by donations.created_at 
        // limit 10
        // offset 0`

        
    }

    async findDonationsByDate({ ngo_id, startDate, endDate, orderBy }: IFindOptions) {
        
         // buscar tbm por is payed or is_canceled
         let query = this.repository.createQueryBuilder("donations")
         .leftJoinAndSelect("donations.worker", "workers")
         .leftJoinAndSelect("donations.donor", "donors")
         .leftJoinAndSelect("donations.ngo", "ngos")
         .select(["donations","workers","donors","ngos"])
         .where("donations.ngo_id = :ngo_id ", {ngo_id})
 
         if(startDate && endDate){
             query.andWhere("donations.created_at between :startDate and :endDate ", {startDate, endDate})
         }
 
 
         if(orderBy){

                query.orderBy("donations.donation_number", orderBy)
            
         }
 
 
         const results = await query.getMany()
 
       
         return results
        
 
         
    }

    async findOneById(id: string): Promise<Donation> {

        const donation = await this.repository.findOne({
            relations: {
                donor: true,
                worker: true,
                ngo: true
            },

            where: {
                id
            }
        })

        return donation
    }

    async findDonationsByDonorId(id: string): Promise<Donation[]> {
        return await this.repository.find({
            relations: {
                donor: true,
                worker: true,
                ngo: true
            },
            where: { donor_id: id }
                
        })
        
    }
    
    // ja tem countDonationsValues ja faz isso
    async findDonationsByWorker(worker_id: string, { orderBy, limit, offset, startDate, endDate }: IFindOptions): Promise<Donation[]> {
        //FAZER COM QUERYBUILDER E GET MANY AND COUNT
        let query = `select donations.*
         from donations
         left join workers on donations.worker_id = workers.id
         where donations.worker_id = '${worker_id}' 
        `



        if (startDate && endDate) { // se tiver datas, junta com o 1 valor
            query += `and donations.created_at between '${startDate}' and '${endDate}' `

        }

        if (orderBy) {
            query += `order by donations.created_at ${orderBy} `
        }

        if (limit) {
            query += `limit ${limit} `
        }

        if (offset) {
            query += `offset ${offset} `
        }

        const donations = await this.repository.query(query) as Donation[]

        return donations



    }

    async findDonationByNumberAndNgoId({donation_number, ngo_id}: IFindOptions): Promise<Donation>{


        return await this.repository.findOne({
            relations: {
                donor: true,
                worker: true,
                ngo: true
            },
            where:{donation_number, ngo_id}
        })
    }


    async markDonationAsCanceled(id: string): Promise<Donation> {
        const canceledDonation = this.repository.create({
            id,
            is_donation_canceled: true
        })

        return await this.repository.save(canceledDonation)

        
    }

    async markEmailSentForDonation(id: string){
        const updateMailSent = this.repository.create({
            id,
            is_email_sent: true
        })

        return await this.repository.save(updateMailSent)

        
    }

    async markMessageSentForDonation(id: string){
        const updateMessageSent = this.repository.create({
            id,
            sent_by_message: true
        })

        return await this.repository.save(updateMessageSent)

        
    }

}

export { DonationsRepository }

