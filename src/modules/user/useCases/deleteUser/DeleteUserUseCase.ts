

import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";


import { AppError } from "../../../../shared/errors/AppError";
import { validatePassword } from "../../../../utils/passwordUtils";

interface IRequest {
    user_id: string
    admin_id: string
    password: string
}

@injectable()
class DeleteUserUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute({user_id, admin_id, password}: IRequest) {

        
        

        if(admin_id === ""){
            throw new AppError("Usuário invalido", 400)
            
        }

        if(!user_id || user_id === undefined) throw new AppError("Usuario nao encontrado", 400)
        
        const user = await this.usersRepository.findById(user_id)
        
        if(!user){
            throw new AppError("Usuario nao encontrado", 400)
        }

        if(user.admin || user.master){

            if(user.master){
                throw new AppError("Não é possivel deletar o admin master.", 400)

            }
            
            const admin_users = await this.usersRepository.countAdmins()

            if(admin_users <= 1){

                throw new AppError("Não foi possível deletar o Usuário. Deve haver pelo menos um admin", 400)
            }

            if(user.id !== admin_id){
                throw new AppError("Não é possível deletar outro admin", 400)
            }

            if(user.id === admin_id && !validatePassword(password, user.salt, user.password_hash)){

                throw new AppError("Digite a sua senha para deletar seu cadastro", 400)
            }
        }

        await this.usersRepository.delete(user_id)
        
        
        
    }
}

export { DeleteUserUseCase }