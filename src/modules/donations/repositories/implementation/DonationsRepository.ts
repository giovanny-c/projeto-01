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

    async findOneBy(property: string, value: string): Promise<Donation> {


        let donation

        if (property === "id") {

            donation = await this.repository.findBy({
                id: value
            })
        }

        if (property === "user_id") {

            donation = await this.repository.findBy({
                user_id: value
            })
        }

        if (property === "donor_id") {

            donation = await this.repository.findBy({
                donor_id: value
            })
        }

        return donation
    }
    donationPayed(id: string): Promise<Donation> {
        throw new Error("Method not implemented.");
    }

}

export { DonationsRepository }