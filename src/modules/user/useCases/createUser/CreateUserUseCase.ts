import { IUserRepository } from "../../repositories/IUserRepository";



class CreateUserUseCase {


    constructor(private usersRepository: IUserRepository) {
    }

    async execute(name: string): Promise<void> {
        const userAlreadyExists = await this.usersRepository.findByName(name)

        if (userAlreadyExists) {
            throw new Error("Category already exists!")
        }

        await this.usersRepository.create({ name })

    }
}

export { CreateUserUseCase }