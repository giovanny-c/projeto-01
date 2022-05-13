import { inject, injectable } from "tsyringe";
import { sign, verify } from "jsonwebtoken"
import auth from "../../../../config/auth"
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";

interface IPayload {
    sub: string
    name: string
}

interface ITokenResponse {
    token: string
    refresh_token: string
}

@injectable()
class RefreshTokenUseCase {

    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ) { }

    async execute(token: string): Promise<ITokenResponse> {

        const { name, sub } = verify(token, auth.secret_refresh_token) as IPayload

        const user_id = sub

        const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken({ user_id, refresh_token: token })


        if (!userToken) {
            throw new AppError("Refresh Token does not exists")
        }

        await this.usersTokensRepository.deleteById(userToken.id)


        //cria um novo refresh token
        const refresh_token = sign({ name }, auth.secret_refresh_token, {
            subject: user_id,
            expiresIn: auth.expires_in_refresh_token
        })

        const refresh_token_expires_date = this.dateProvider.addOrSubtractTime("add", "day", auth.expires_refresh_token_days) //+ 30 dias 

        await this.usersTokensRepository.create({
            refresh_token: refresh_token,
            expires_date: refresh_token_expires_date,
            user_id: user_id
        })

        //criando novo token
        const newToken = sign({}, auth.secret_token, {
            subject: user_id,
            expiresIn: auth.expires_in_token
        })

        return {
            token: newToken,
            refresh_token
        }
    }
}

export { RefreshTokenUseCase }