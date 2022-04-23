import { Repository } from "typeorm";

import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { IDonorsRepository } from "../IDonorsRepository";

import { Donor } from "../../entities/donor";
import { dataSource } from "../../../../database";


class DonorsRepository implements IDonorsRepository {

    private repository: Repository<Donor>

    constructor() {
        this.repository = dataSource.getRepository(Donor)
    }

    async create({ name, email, phone }: ICreateDonorDTO): Promise<void> {
        const donor = this.repository.create({
            name,
            email,
            phone
        })

        await this.repository.save(donor)
    }

    async findByEmail(email: string): Promise<Donor> {

        const donor = await this.repository.findOne({ where: { email } })

        return donor
    }
    async findById(id: string): Promise<Donor> {
        const donor = await this.repository.findOne({ where: { id } })

        return donor
    }
    async findAll(): Promise<Donor[]> {
        return await this.repository.find()
    }

}

export { DonorsRepository }