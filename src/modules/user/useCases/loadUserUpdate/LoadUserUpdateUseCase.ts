

import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import { User } from "../../entities/user";
import { instanceToPlain } from "class-transformer";

interface IRequest {
    id: string
}

@injectable()
class LoadUserUpdateUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute({id}: IRequest): Promise<User> {

        const user = await this.usersRepository.findById(id)
        
        
        return instanceToPlain(user) as User
        
    }
}

export { LoadUserUpdateUseCase }