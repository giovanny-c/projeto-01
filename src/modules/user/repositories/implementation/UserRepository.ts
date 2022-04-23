import { User } from "../../entities/user";
import { IUserRepository } from "../IUserRepository";

import { Repository } from "typeorm"
import { dataSource } from "../../../../database";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";


class UserRepository implements IUserRepository {

    private repository: Repository<User>

    constructor() {
        this.repository = dataSource.getRepository(User)
    }


    async create({ name }: ICreateUserDTO): Promise<void> {

        const user = this.repository.create({
            name
        })

        await this.repository.save(user)
    }

    async find(): Promise<User[]> {
        const users = await this.repository.find()

        return users
    }

    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne({ where: { id } })

        return user
    }

    async findByName(name: string): Promise<User> {
        const user = await this.repository.findOne({ where: { name } })

        return user
    }
}

export { UserRepository }