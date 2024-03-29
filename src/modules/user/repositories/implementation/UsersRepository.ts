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


    async create({ id, name, password_hash, salt, admin, email, worker_id }: ICreateUserDTO): Promise<User> {

        const user = this.repository.create({
            id,
            name,
            salt,
            password_hash,
            admin,
            email,
            worker_id
        })

        return await this.repository.save(user)
    }

    async find(): Promise<User[]> {
        const users = await this.repository.find({
            relations: {
                worker: true
            }
        })

        return users
    }

    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne({
            relations: {
                worker: true
            },
            where: { id } 
        })

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

    async countAdmins(): Promise<number>{

        const count = await this.repository.countBy({admin: true})

        return count

    }

    async findOneByEmailOrName(nameOrEmail: string): Promise<User> {
        const user = await this.repository.findOneBy([{email: nameOrEmail}, {name: nameOrEmail}])

        return user
    }

    async findByNameOrEmail(name: string, email: string): Promise<User[]> {
        const users = await this.repository.findBy([{email}, {name}])

        return users
    }

    async delete(id: string){

        await this.repository.delete(id)
    }
}

export { UsersRepository }