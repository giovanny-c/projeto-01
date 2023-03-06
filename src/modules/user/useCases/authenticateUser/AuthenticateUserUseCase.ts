import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";

import {instanceToPlain} from "class-transformer"

import { AppError } from "../../../../shared/errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";

import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { validatePassword } from "../../../../../utils/passwordUtils";

interface IRequest {
    nameOrEmail: string
    password: string
}

interface IResponse {
    user: {
        id: string
        name: string,
        admin?: boolean 
    }
    created_at: Date

}


@injectable()
class AuthenticateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ) { }

    async execute({ nameOrEmail, password }: IRequest): Promise<IResponse> {

        const user = await this.usersRepository.findOneByEmailOrName(nameOrEmail); //mudar depois


        if (!user) {
            throw new AppError("name or password incorrect")
        }

        const passwordMatch = validatePassword(password, user.salt, user.password_hash)

        if (!passwordMatch) { //trocar para validate password
            throw new AppError("name or password incorrect")

        }

        await this.cacheProvider.setRedis(`user-${user.id}`, JSON.stringify(instanceToPlain(user)))

        const created_at = this.dateProvider.dateNow()


        return {
            user: {
                id: user.id,
                name: user.name,
                admin: user.admin
            },
            created_at
        }
        
        
        
        
    }

}

export { AuthenticateUserUseCase }