

import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import { User } from "../../entities/user";

interface IRequest {
    name: string
    password: string
}

@injectable()
class LoadUsersUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute(): Promise<User[]> {

        const users = await this.usersRepository.find()
        
        return users
        
    }
}

export { LoadUsersUseCase }