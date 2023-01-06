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

    async countDonationsValues(worker_id: string, { startDate, endDate }: IFindOptions) {
        let querySum = `select sum (donations.donation_value)
            from donations left join workers on donations.worker_id = workers.id
            where `
        
        
        if(worker_id){
            querySum += `    
            donations.worker_id = '${worker_id} and'  
         `
        }

        querySum += ` donations.is_payed = true and is_donation_canceled = false`

        if (startDate && endDate) { // se tiver datas, junta com o 1 valor
            querySum += `and donations.created_at between '${startDate}' and '${endDate}' `
        }

        const totalValue = await this.repository.query(querySum)

        return totalValue[0].sum
    }

    async findForGenerateBead({ donationNumberInterval, ngo_id }: IFindOptions): Promise<Donation[]> {
        return await this.repository.createQueryBuilder("donations")
        .leftJoin("donations.worker", "workers")
        .leftJoin("donations.donor", "donors")
        .leftJoin("donations.ngo", "ngos")
        .select(["donations","workers","donors","ngos"])
        .where("donations.ngo_id = :ngo_id", {ngo_id})
        .andWhere(`donations.donation_number BETWEEN ${donationNumberInterval[0]} AND ${donationNumberInterval[1]} `)
        .getMany()

    }

    async findDonationsBy({ value, orderBy, limit, offset, startDate, endDate }: IFindOptions): Promise<Donation[]> {
        // buscar tbm por is payed or is_canceled
        let query = `select donations.*,
         donors.name as donor, 
         workers.name as worker 
         from donations
         left join donors on donations.donor_id = donors.id
         left join workers on donations.worker_id = workers.id `

        if (value) {//se tiver valor
            query += `where donors.name ilike '%${value}%' `

            if (startDate && endDate) { // se tiver datas, junta com o 1 valor
                query += `and donations.created_at between '${startDate}' and '${endDate}' `
            }

            //poe o segundo parametro de valor
            query += `or 
                      workers.name ilike '%${value}%' `

            if (startDate && endDate) { // junta com o segundo valor
                query += `and donations.created_at between '${startDate}' and '${endDate}' `
            }
        }

        if (!value && (startDate && endDate)) { //se nao tiver valor mas tiver datas

            query += ` where donations.created_at between '${startDate}' and '${endDate}' `
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

        const results = await this.repository.query(query)

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


        // const results = await this.repository.find({

        //     relations: {
        //         user: true,
        //         donor: true,
        //         worker: true
        //     },
        //     select: {

        //         donor: {
        //             name: true,
        //             email: true
        //         },

        //         user: {
        //             name: true
        //         },
        //         worker: {
        //             name: true
        //         }



        //     },

        //     where: [//colchete no where = OR 

        //         //chaves na coluna ou relaçao = OR

        //         {
        //             donor: [
        //                 { name: ILike(`%${value}%`) },
        //                 //OR 
        //                 { email: ILike(`%${value}%`) }
        //             ],
        //             //AND
        //             created_at: Between(startDate, endDate)
        //         },
        //         //OR
        //         {
        //             worker: [
        //                 { name: ILike(`%${value}%`) }
        //             ],
        //             created_at: Between(startDate, endDate)
        //         },
        //         {
        //             user: [
        //                 { name: ILike(`%${value}%`) },
        //             ],
        //             created_at: Between(startDate, endDate),

        //         },

        //     ],
        //     order: {
        //         created_at: orderBy as FindOptionsOrderValue
        //     },
        //     skip: offset,
        //     take: limit
        //     
        //     

        // })

        return results
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