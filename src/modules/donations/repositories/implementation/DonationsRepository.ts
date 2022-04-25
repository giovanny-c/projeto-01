import { Repository } from "typeorm";
import { dataSource } from "../../../../database";
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
    async findBy(property: string, value: string): Promise<Donation[]> {

        let donations

        if (property === "id") {

            donations = await this.repository.findBy({
                id: value
            })
        }

        if (property === "user_id") {

            donations = await this.repository.findBy({
                user_id: value
            })
        }

        if (property === "donor_id") {

            donations = await this.repository.findBy({
                donor_id: value
            })
        }

        return donations

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