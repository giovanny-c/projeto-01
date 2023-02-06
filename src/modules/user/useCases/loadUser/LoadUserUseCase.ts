

import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import { User } from "../../entities/user";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { instanceToPlain, plainToInstance } from "class-transformer";

@injectable()
class LoadUserUseCase {


    constructor(
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute(user_id): Promise<User> {

        let user 

        user = JSON.parse(await this.cacheProvider.getRedis(`user-${user_id}`))

        user = await this.usersRepository.findById(user_id)
        
        if(!user){
            
            if(!user){
                throw new AppError("Usuario nao encontrado", 404)       
            }
        }
        

        
        return instanceToPlain(user) as User
        
    }
}

export { LoadUserUseCase }