import { inject, injectable } from "tsyringe"
import { AppError } from "../../../../shared/errors/AppError"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider"
import { User } from "../../entities/user"





@injectable()
class LogOutUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider
        
    ) {

    }

    async execute( user_id: string ): Promise<void> {
        
            let user = JSON.parse(await this.cacheProvider.get(`user-${user_id}`)) as User

            if(!user){

                user = await this.usersRepository.findById(user_id)
                
                if (!user) {
                    throw new AppError("Usuário não emcontrado", 400)
                }    
            }


            // await this.cacheProvider.delete(`user-${user.id}`)
    }


}

export { LogOutUseCase }