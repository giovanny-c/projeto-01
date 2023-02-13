import { User } from "../../entities/user";
import { IUsersRepository } from "../IUsersRepository";

import { Repository } from "typeorm"
import { dataSource } from "../../../../database";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";


class UsersRepository implements IUsersRepository {

    private repository: Repository<User>

    constructor() {
        this.repository = dataSource.getRepository(User)
    }


    async create({ id, name, password_hash, salt, admin = false, email }: ICreateUserDTO): Promise<User> {

        const user = this.repository.create({
            id,
            name,
            salt,
            password_hash,
            admin,
            email
        })

        return await this.repository.save(user)
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

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({ where: { email } })

        return user
    }

    async findByNameOrEmail(name: string, email: string): Promise<User[]> {
        const users = await this.repository.findBy([{name}, {email}])

        return users
    }

    async delete(id: string){

        await this.repository.delete(id)
    }
}

export { UsersRepository }