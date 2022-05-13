import { inject, injectable } from "tsyringe";
import { compare } from "bcryptjs";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { sign } from "jsonwebtoken"

import auth from "../../../../config/auth";
import { AppError } from "../../../../shared/errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

interface IRequest {
    name: string
    password: string
}

interface IResponse {
    user: {
        name: string,
    }
    token: string
    refresh_token: string

}


@injectable()
class AuthenticateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ) { }

    async execute({ name, password }: IRequest): Promise<IResponse> {

        const user = await this.usersRepository.findByName(name); //mudar depois


        const { expires_in_token, secret_token, secret_refresh_token, expires_refresh_token_days, expires_in_refresh_token } = auth

        if (!user) {
            throw new AppError("name or password incorrect")
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new AppError("name or password incorrect")

        }

        //cria o token
        const token = sign({}, secret_token, {
            subject: user.id,
            expiresIn: expires_in_token
        })

        const refresh_token = sign({ name }, secret_refresh_token, {
            subject: user.id,
            expiresIn: expires_in_refresh_token // 30d
        })

        const refresh_token_expires_date = this.dateProvider.addOrSubtractTime("add", "day", expires_refresh_token_days) //+ 30 dias 

        await this.usersTokensRepository.create({
            refresh_token: refresh_token,
            expires_date: refresh_token_expires_date,
            user_id: user.id
        })

        const tokenReturn: IResponse = {
            user: {
                name
            },
            token,
            refresh_token
        }

        //TIPs 
        //fazer uma validaçao por ip (se e o mesmo ip nao gera um novo token)
        //auth 2.0
        //passar os tokens para o req.headers ?
        return tokenReturn
    }

}

export { AuthenticateUserUseCase }