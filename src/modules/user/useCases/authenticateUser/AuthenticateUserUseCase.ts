import { inject, injectable } from "tsyringe";
import { compare } from "bcryptjs";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { sign } from "jsonwebtoken"

import auth from "../../../../config/auth";

interface IRequest {
    name: string
    password: string
}

interface IResponse {
    user: {
        name: string,
    }
    token: string

}


@injectable()
class AuthenticateUserUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    async execute({ name, password }: IRequest): Promise<IResponse> {

        const user = await this.usersRepository.findByName(name); //mudar depois

        const { expires_in_token, secret_token } = auth

        if (!user) {
            throw new Error("name or password incorrect")
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new Error("name or password incorrect")

        }

        const token = sign({}, secret_token, {
            subject: user.id,
            expiresIn: expires_in_token
        })

        const tokenReturn: IResponse = {
            user: {
                name
            },
            token
        }

        return tokenReturn
    }

}

export { AuthenticateUserUseCase }