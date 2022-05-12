import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

interface IPayload {
    sub: string
    email: string
}

interface ITokenResponse {
    token: string
    refresh_token: string
}

@injectable()
class RefreshTokenUseCase {

    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private userTokensRepository: IUsersTokensRepository
    ) { }

    async execute(): Promise<ITokenResponse> {

        return


    }
}