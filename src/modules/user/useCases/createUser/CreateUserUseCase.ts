import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { genPassword } from "../../../../../utils/passwordUtils";
import { instanceToPlain } from "class-transformer"
import { User } from "../../entities/user";

interface IRequest {
    name: string
    password: string
}

@injectable()
class CreateUserUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute({ name, password}: IRequest): Promise<User> {

        const userAlreadyExists = await this.usersRepository.findByName(name)

        if (userAlreadyExists) {
            throw new AppError("this user already exists!")
        }

        if (!password || password === undefined) {

            throw new AppError("Please provide a valid password", 400)
        }

        //fazer um match password com o joi

        const {salt, hash} = genPassword(password)

        const user = await this.usersRepository.create({ name, password_hash: hash, salt})
        
        return instanceToPlain(user) as User
    }
}

export { CreateUserUseCase }