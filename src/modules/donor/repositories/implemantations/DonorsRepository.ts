import { ILike, Repository } from "typeorm";

import { ICreateDonorDTO } from "../../dtos/ICreateDonorDTO";
import { IDonorsRepository } from "../IDonorsRepository";

import { Donor } from "../../entities/donor";
import { dataSource } from "../../../../database";



class DonorsRepository implements IDonorsRepository {

    private repository: Repository<Donor>

    constructor() {
        this.repository = dataSource.getRepository(Donor)
    }

    async create({ id, name, email, phone, last_donation, user_id, worker_id }: ICreateDonorDTO): Promise<Donor> {
        const donor = this.repository.create({
            id,
            name,
            email,
            phone,
            last_donation,
            user_id,
            worker_id
        })

        return await this.repository.save(donor)
    }

    async findByEmail(email: string): Promise<Donor> {

        const donor = await this.repository.findOne({ where: { email } })

        return donor
    }
    async findByName(name: string): Promise<Donor>{
        const donor = await this.repository.findOne({ where: { name } })

        return donor
    }
    async findById(id: string): Promise<Donor> {
        const donor = await this.repository.findOne({ where: { id } })

        return donor
    }
    async findBy(value: string, limit = 30, offset: number, user_id?: string): Promise<Donor[]> {

        let donors = this.repository.createQueryBuilder("donors")
        .select("donors")
        .leftJoinAndSelect("donors.user","users")
        .leftJoinAndSelect("donors.worker","workers")
        .where("donors.name ILIKE :name ", {name: `%${value}%`})
        .orWhere("donors.email ILIKE :email ", {email: `%${value}%`})
        // .orWhere("donors.phone ILIKE :phone ", {phone: `%${value}%`})
        
        if(user_id){
            donors.andWhere("donors.user_id = :user_id OR donors.user_id = NULL", {user_id})
        }
        
        donors.limit(limit)
        .offset(offset)
        .orderBy(`donors.name`, "ASC", "NULLS LAST")
        

        return await donors.getMany()
        // const donors = await this.repository.find({

        //     where: [
        //         { name: ILike(`%${value}%`) },
        //         { email: ILike(`%${value}%`) },
        //         { phone: ILike(`%${value}%`) },
        //     ],
            

        // })

        // return donors
    }

    async delete(id: string) {
        await this.repository.delete(id)
    }


}

export { DonorsRepository }