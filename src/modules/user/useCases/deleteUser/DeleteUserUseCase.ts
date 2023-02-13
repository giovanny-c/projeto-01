

import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

import { User } from "../../entities/user";
import { instanceToPlain } from "class-transformer";
import { AppError } from "../../../../shared/errors/AppError";

interface IRequest {
    user_id: string
    admin_id: string
}

@injectable()
class DeleteUserUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute({user_id, admin_id}: IRequest) {

        if(admin_id === ""){
            throw new AppError("Usuário invalido", 400)
            
        }
        if(!user_id || user_id === undefined) throw new AppError("Usuario nao encontrado", 400)
        

        const users = await this.usersRepository.find()
        
        let user = users.find(user => user.id === user_id)

        if(!user){
            throw new AppError("Usuario nao encontrado", 400)
        }

        if(user.admin){

            const admin_users = users.filter(user => user.admin === true)

            if(admin_users.length <= 1){

                throw new AppError("Não foi possível deletar o Usuário. Deve haver pelo menos um admin", 400)
            }

            if(user.id !== admin_id){
                throw new AppError("Não é possível deletar outro admin", 400)
            }
        }
        
        await this.usersRepository.delete(user_id)
        
        
        
    }
}

export { DeleteUserUseCase }