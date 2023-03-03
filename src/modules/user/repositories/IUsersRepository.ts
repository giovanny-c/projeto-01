
import { ICreateUserDTO } from "../dtos/ICreateUserDTO"
import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO"
import { User } from "../entities/user"

interface IUsersRepository {

    create(data: ICreateUserTokenDTO): Promise<User>
    find(): Promise<User[]>
    findById(id: string): Promise<User>
    findByName(name: string): Promise<User>
    findByEmail(email: string): Promise<User>
    findByNameOrEmail(name: string, email: string): Promise<User[]>
    countAdmins(): Promise<number>
    delete(id: string)
}

export { IUsersRepository }