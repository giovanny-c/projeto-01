import { Between, FindOptionsOrderValue, ILike, QueryBuilder, Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { Donor } from "../../../donor/entities/donor";
import { IFindOptions } from "../../dtos/IFindOptionsDTO";
import { Donation } from "../../entities/donation";
import { IDonationsRepository } from "../IDonationsRepository";



class DonationsRepository implements IDonationsRepository {

    private repository: Repository<Donation>

    constructor() {

        this.repository = dataSource.getRepository(Donation)
    }
    async findDonationsForWorker(worker_id: string, { orderBy, limit, offset, startDate, endDate }: IFindOptions): Promise<Donation[]> {

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

        const results = await this.repository.query(query)

        return results



    }

    async create({ id, user_id, donor_id, donation_value, is_payed, payed_at, donation_number, created_at, is_donation_canceled, worker_id }: ICreateDonationsDTO): Promise<void> {

        const donation = this.repository.create({
            id,
            user_id,
            donor_id,
            worker_id,
            donation_value,
            donation_number,
            is_payed,
            payed_at,
            //created_at,
            is_donation_canceled,


        })

        await this.repository.save(donation)


    }

    async findDonationsByUserOrDonorId(id: string): Promise<Donation[]> {
        const results = await this.repository.find({
            where: [
                { donor_id: id },
                { user_id: id }
            ]
        })
        return results
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

        const donation = await this.repository.findOneBy({
            id: value
        })


        return donation
    }


    async MarkDonationAsPayed({ id, donation_number, donor_id, user_id, donation_value }: ICreateDonationsDTO, payed_at: Date): Promise<Donation> {


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