import { inject, injectable } from "tsyringe"
import { AppError } from "../../../../shared/errors/AppError"
import { IUsersRepository } from "../../repositories/IUsersRepository"




@injectable()
class LogOutUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        
    ) {

    }

    async execute( user_id: string ): Promise<void> {
        
            const user = await this.usersRepository.findById(user_id)

            if (!user) {
                throw new AppError("User not found", 400)
            }

    }


}

export { LogOutUseCase }