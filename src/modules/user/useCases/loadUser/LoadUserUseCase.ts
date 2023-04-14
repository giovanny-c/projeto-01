

import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import { User } from "../../entities/user";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { instanceToPlain, plainToInstance } from "class-transformer";

interface IRequest{
    user_id: string,
    admin_user_id: string | void
}
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

    async execute({user_id, admin_user_id}: IRequest) {

        if(!admin_user_id){
            throw new AppError("Apenas Admins tem acesso a essa area")
        }

        const admin_user = instanceToPlain(await this.usersRepository.findById(admin_user_id)) as User

        let user 

        user = JSON.parse(await this.cacheProvider.get(`user-${user_id}`))

        user = await this.usersRepository.findById(user_id)
        
        if(!user){
            
            if(!user){
                throw new AppError("Usuario nao encontrado", 404)       
            }
        }
        

        
        return{ 
            user: instanceToPlain(user) as User,
            admin_user
        }
    }
}

export { LoadUserUseCase }