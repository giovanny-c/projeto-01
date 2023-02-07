import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { genPassword } from "../../../../../utils/passwordUtils";
import { instanceToPlain } from "class-transformer"
import { User } from "../../entities/user";

interface IRequest {
    id: string
    name: string
    password: string
    confirm_password: string
    admin: boolean
    email: string
}

@injectable()
class UpdateUserUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute({id, name, password, confirm_password, admin, email}: IRequest): Promise<User> {


        admin? admin = true : admin = false


        if((!name || name === undefined) || !name.match(/([A-Za-z0-9ãõç]{3,})/g)){
            throw new AppError("Forneça um nome de usuário valido", 400)
        }

        if((!email || email === undefined) || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("Forneça um email valido", 400)
        }

        if ((!password || password === undefined) || !password.match(/([A-Za-z0-9ãõç\-.*&$#@!?=+_]{4,})/g)) {
            throw new AppError("Forneça um senha valida", 400)
        }

        if(password !== confirm_password){

            throw new AppError("A senha e a confirmação não combinam", 400)
        }


        const userAlreadyExists = await this.usersRepository.findByNameOrEmail(name, email)

        if (userAlreadyExists.filter(user => user.id !== id )) {// se tiver encontrado um user com id diferente
            
            throw new AppError("Esse usuário ja existe", 400)
        
        }
        

        const {salt, hash} = genPassword(password)

        const user = await this.usersRepository.create({ name, password_hash: hash, salt, admin, email})


        return instanceToPlain(user) as User
    }
}

export { UpdateUserUseCase }