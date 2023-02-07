import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { genPassword } from "../../../../../utils/passwordUtils";
import { instanceToPlain } from "class-transformer"
import { User } from "../../entities/user";

interface IRequest {
    name: string
    password: string
    confirm_password: string
}

@injectable()
class CreateUserUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute({ name, password, confirm_password}: IRequest): Promise<User> {

        const userAlreadyExists = await this.usersRepository.findByName(name)

        if (userAlreadyExists) {
            throw new AppError("Esse usuário ja existe", 400)
        }

        if((!name || name === undefined) || !name.match(/([A-Za-z0-9ãõç]{3,})/g)){
            throw new AppError("Forneça um nome de usuário valido", 400)
        }

        if ((!password || password === undefined) || !password.match(/([A-Za-z0-9ãõç\-.*&$#@!?=+_]{4,})/g)) {

            throw new AppError("Forneça um senha valida", 400)
        }

        if(password !== confirm_password){

            throw new AppError("A senha e a confirmação não combinam", 400)
        }

        //fazer um match password com o joi

        const {salt, hash} = genPassword(password)

        const user = await this.usersRepository.create({ name, password_hash: hash, salt})


        return instanceToPlain(user) as User
    }
}

export { CreateUserUseCase }