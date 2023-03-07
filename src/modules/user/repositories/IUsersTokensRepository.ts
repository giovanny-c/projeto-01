import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO"
import { UsersTokens } from "../entities/usersTokens"


interface IUsersTokensRepository {

    create(data: ICreateUserTokenDTO): Promise<UsersTokens>
    findByUserIdAndRefreshToken({ user_id, refresh_token }: ICreateUserTokenDTO): Promise<UsersTokens>
    findByRefreshToken(refresh_token: string): Promise<UsersTokens>
    findByUserId(user_id: string): Promise<UsersTokens[]>
    deleteById(id: string): Promise<void>
}

export { IUsersTokensRepository }