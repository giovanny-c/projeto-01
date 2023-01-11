import { query } from "express";
import { Between, FindOptionsOrderValue, ILike, QueryBuilder, Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { Donor } from "../../../donor/entities/donor";
import { ICreateDonationsDTO } from "../../dtos/ICreateDonationsDTO";
import { IFindOptions } from "../../dtos/IFindOptionsDTO";
import { Donation } from "../../entities/donation";
import { IDonationsRepository } from "../IDonationsRepository";



class DonationsRepository implements IDonationsRepository {

    private repository: Repository<Donation>

    constructor() {

        this.repository = dataSource.getRepository(Donation)
    }


    

    async create({user_id, donor_id, donor_name, ngo_id ,donation_value, is_payed, payed_at, donation_number, created_at, is_donation_canceled, worker_id }: ICreateDonationsDTO): Promise<Donation> {

        const donation = this.repository.create({
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

    async countDonationsValues(worker_id: string, { startDate, endDate, donation_number_interval }: IFindOptions): Promise<[Donation[], number]> {
        
        let query = await this.repository.createQueryBuilder("donations")
        .leftJoin("donations.worker", "workers")
        .leftJoin("donations.ngo", "ngos")
        .leftJoinAndSelect("donations.donor", "donors")
        .select(["donations", "workers", "ngos", "donors"])
        .where("donation.is_donation_canceled != true")

        if((!startDate || !endDate) && (donation_number_interval && donation_number_interval.length)){
            query = query.andWhere(`donations.donation_number BETWEEN ${donation_number_interval[0]} AND ${donation_number_interval[1]}` )
        }

        query = query.andWhere(`donations.created_at BETWEEN ${startDate} AND ${endDate}`)

        if(worker_id){
            query = query.andWhere("donations.worker_id = :worker_id", {worker_id})
        }

        return query.getManyAndCount()
    }

    async findForGenerateBead({ donation_number_interval, ngo_id }: IFindOptions): Promise<Donation[]> {
        return await this.repository.createQueryBuilder("donations")
        .leftJoinAndSelect("donations.worker", "workers")
        .leftJoinAndSelect("donations.donor", "donors")
        .leftJoinAndSelect("donations.ngo", "ngos")
        .select(["donations","workers","donors","ngos"])
        .where("donations.ngo_id = :ngo_id", {ngo_id})
        .andWhere(`donations.donation_number BETWEEN ${donation_number_interval[0]} AND ${donation_number_interval[1]} `)
        .orderBy("donations.donation_number", "ASC")
        .getMany()

    }

    //REFAZER COM QUERY BUILDER
    async findDonationsBy({ value, orderBy, limit, offset, startDate, endDate }: IFindOptions): Promise<[Donation[], number]> {
        // buscar tbm por is payed or is_canceled
        let query = await this.repository.createQueryBuilder("donations")
        .leftJoinAndSelect("donations.worker", "workers")
        .leftJoinAndSelect("donations.donor", "donors")
        .leftJoinAndSelect("donations.ngo", "ngos")
        .select(["donations","workers","donors","ngos"])
        .where("")

        //continuar amanha


        return query.getManyAndCount()
        

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

    async findOneById(value: string): Promise<Donation> {

        const donation = await this.repository.findOne({
            relations: {
                donor: true,
                worker: true,
                ngo: true
            },

            where: {
                id: value
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

    async MarkDonationAsPayed({ id, donation_number, donor_id, user_id, donation_value  }: ICreateDonationsDTO, payed_at: Date): Promise<Donation> {


        const payedDonation = this.repository.create({
            id,
            donation_number,
            donor_id,
            user_id,
            donation_value,
            is_payed: true,
            payed_at,

        })

        const donation = await this.repository.save(payedDonation)

        return donation


    }

    async MarkDonationAsCanceled(id: string): Promise<Donation> {
        const canceledDonation = this.repository.create({
            id,
            is_donation_canceled: true
        })

        const donation = await this.repository.save(canceledDonation)

        return donation
    }

}

export { DonationsRepository }

/**relations: {
    user: true,
    donor: true
},
where: [ //colchete no where = OR 

    //chaves na coluna ou relaçao = OR
    {
        user: [
            { name: ILike(`%${value}%`) },
        ]
    },
    {
        donor: [ //OR 
            { name: ILike(`%${value}%`) },
            { email: ILike(`%${value}%`) }
        ]
    },
    //OR
    { donation_number: ILike(`%${value}%`) },
    { donation_value: ILike(`%${value}%`) },
    //converter date para string
    //limit e offset
    //is payed or canceled


]
}) */