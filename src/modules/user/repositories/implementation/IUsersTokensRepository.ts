import { Repository } from "typeorm";
import { dataSource } from "../../../../database";
import { ICreateUserTokenDTO } from "../../dtos/ICreateUserTokenDTO";
import { UsersTokens } from "../../entities/usersTokens";
import { IUsersTokensRepository } from "../IUsersTokensRepository";


class UsersTokensRepository implements IUsersTokensRepository {

    private repository: Repository<UsersTokens>

    constructor() {
        this.repository = dataSource.getRepository(UsersTokens)
    }

    async create({ expires_date, user_id, refresh_token }: ICreateUserTokenDTO): Promise<UsersTokens> {
        const userToken = this.repository.create({
            expires_date,
            refresh_token,
            user_id
        })

        await this.repository.save(userToken)

        return userToken
    }

    async findByUserIdAndRefreshToken({ user_id, refresh_token }: ICreateUserTokenDTO): Promise<UsersTokens> {
        const userToken = await this.repository.findOne({
            where: { user_id, refresh_token }
        })

        return userToken
    }

    async findByRefreshToken(refresh_token: string): Promise<UsersTokens> {

        const userToken = await this.repository.findOne({ where: { refresh_token } })

        return userToken
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id)
    }

}

export { UsersTokensRepository }