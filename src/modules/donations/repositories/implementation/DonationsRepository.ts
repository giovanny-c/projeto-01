import { Between, FindOptionsOrderValue, ILike, Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { IFindOptions } from "../../dtos/IFindOptionsDTO";
import { Donation } from "../../entities/donation";
import { IDonationsRepository } from "../IDonationsRepository";



class DonationsRepository implements IDonationsRepository {

    private repository: Repository<Donation>

    constructor() {

        this.repository = dataSource.getRepository(Donation)
    }

    async create({ user_id, donor_id, donation_value }: ICreateDonationsDTO): Promise<void> {

        const donation = this.repository.create({
            user_id,
            donor_id,
            donation_value
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

        //fazer com query builder!
        const results = await this.repository.find({

            relations: {
                user: true,
                donor: true
            },
            select: {

                donor: {
                    name: true,
                    email: true
                },

                user: {
                    name: true
                }


            },

            where: [//colchete no where = OR 

                //chaves na coluna ou relaçao = OR

                {
                    user: [
                        { name: ILike(`%${value}%`) },
                    ], //AND
                    created_at: Between(startDate, endDate),

                },
                //OR
                {
                    donor: [
                        { name: ILike(`%${value}%`) },//OR 
                        { email: ILike(`%${value}%`) }
                    ],
                    created_at: Between(startDate, endDate)
                },





            ],
            order: {
                created_at: orderBy as FindOptionsOrderValue
            },
            skip: offset,
            take: limit
            //converter date para string
            //limit e offset
            //is payed or canceled

        })

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