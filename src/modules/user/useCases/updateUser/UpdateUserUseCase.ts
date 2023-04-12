import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { genPassword, validatePassword } from "../../../../../utils/passwordUtils";
import { instanceToPlain } from "class-transformer"
import { User } from "../../entities/user";

interface IRequest {
    id: string
    name: string
    password: string
    email: string
    is_admin: string

    admin_id: string
    worker_id?: string
}

@injectable()
class UpdateUserUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository) {
    }

    async execute({id, name, password, is_admin, email, admin_id, worker_id}: IRequest): Promise<User> {

        if(admin_id === ""){
            throw new AppError("Usuário invalido", 400)
            
        }

        if(!id || id === undefined || id === "") throw new AppError("Usuario nao encontrado", 400)

        //se bate o nome
        if((!name || name === undefined) || !name.match(/([A-Za-z0-9ãõç]{3,})/g)){
            throw new AppError("Forneça um nome de usuário valido", 400)
        }

        //se bate o email
        if((!email || email === undefined) || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("Forneça um email valido", 400)
        }

        
        //se tem usuarios com o mesmo email ou nome
        const foundUsers = await this.usersRepository.findByNameOrEmail(name, email)
        
        console.log(foundUsers.filter(user => user.id !== id )[0])

        if (foundUsers.filter(user => user.id !== id ).length) {// se tiver encontrado um user com id diferente do que esta sendo editado
            
            throw new AppError("Esse usuário ja existe", 400)
        
        }

        //pega o user correto

        
        const user = await this.usersRepository.findById(id)

        if(!user){
            throw new AppError("Usuario nao encontrado", 400)
        }

        //se o user for outro admin
        if(user.admin && (user.id !== admin_id )){

            throw new AppError("Voce nao pode editar o usuário de outro admin", 400)
        }

        const admin_users = await this.usersRepository.countAdmins()

        if(admin_users <= 1 && is_admin !== "true"){

            throw new AppError("Não foi possível atualizar o Usuário. Deve haver pelo menos um admin", 400)
        }
        
        //se estiver alterando o propio user e a senha nao for valida
        if(user.id === admin_id && !validatePassword(password, user.salt, user.password_hash)){

            throw new AppError("Digite a sua senha para editar seu cadastro", 400)
        }


        user.name = name
        user.email = email
        user.admin = is_admin === "true" ? true : false  //se admin nao for marcado = false
        user.worker_id = worker_id || null

        return instanceToPlain(await this.usersRepository.create({...user})) as User
    
    
    }
}

export { UpdateUserUseCase }