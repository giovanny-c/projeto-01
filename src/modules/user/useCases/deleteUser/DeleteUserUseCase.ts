

import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";


import { AppError } from "../../../../shared/errors/AppError";
import { validatePassword } from "../../../../utils/passwordUtils";
import { instanceToPlain } from "class-transformer";
import { User } from "../../../user/entities/user";

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
        const admin_user = instanceToPlain(await this.usersRepository.findById(admin_id)) as User
        
        if(!user){
            throw new AppError("Usuario nao encontrado", 400)
        }

        if(!admin_user.admin){
            throw new AppError("Apenas admins podem acessar esse conteudo.", 400)

        }

        //se for master
        if(user.master){
            throw new AppError("Não é possivel deletar o admin master.", 400)

        }
            
        
        //se tentar deletar outro admin e não for admin master
        if(user.id !== admin_id && user.admin && !admin_user.master){
            throw new AppError("Não é possível deletar outro admin", 400)
        }

        //se tentar se deletar
        if(user.id === admin_id){

            throw new AppError("Não foi possivel deletar. Apenas o admin master pode deletar outro admin", 400)
        }
    

        await this.usersRepository.delete(user_id)
        
        
        
    }
}

export { DeleteUserUseCase }