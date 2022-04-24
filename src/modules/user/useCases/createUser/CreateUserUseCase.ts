import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";


@injectable()
class CreateUserUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute({ name, password }: ICreateUserDTO): Promise<void> {

        const userAlreadyExists = await this.usersRepository.findByName(name)

        if (userAlreadyExists) {
            throw new Error("this user exists!")
        }

        const passwordHash = await hash(password, 8)

        await this.usersRepository.create({ name, password: passwordHash })

    }
}

export { CreateUserUseCase }