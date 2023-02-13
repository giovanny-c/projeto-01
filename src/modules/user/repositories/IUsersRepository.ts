
import { ICreateUserDTO } from "../dtos/ICreateUserDTO"
import { User } from "../entities/user"

interface IUsersRepository {

    create(data: ICreateUserDTO): Promise<User>
    find(): Promise<User[]>
    findById(id: string): Promise<User>
    findByName(name: string): Promise<User>
    findByEmail(email: string): Promise<User>
    findByNameOrEmail(name: string, email: string): Promise<User[]>
    delete(id: string)
}

export { IUsersRepository }