
import { ICreateUserDTO } from "../dtos/ICreateUserDTO"
import { User } from "../entities/user"

interface IUsersRepository {

    create(data: ICreateUserDTO): Promise<User>
    find(): Promise<User[]>
    findById(id: string): Promise<User>
    findByName(name: string): Promise<User>
}

export { IUsersRepository }