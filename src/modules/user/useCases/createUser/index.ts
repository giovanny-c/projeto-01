import { UserRepository } from "../../repositories/implementation/UserRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

export default (): CreateUserController => {
    const usersRepository = new UserRepository()

    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const createUserController = new CreateUserController(createUserUseCase)

    return createUserController
}

