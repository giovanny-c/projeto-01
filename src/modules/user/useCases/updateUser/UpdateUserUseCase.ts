import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { genPassword, validatePassword } from "../../../../utils/passwordUtils";
import { instanceToPlain } from "class-transformer"
// import { User } from "../../entities/user";
import {IWorkersReposiroty} from "../../../workers/repositories/IWorkersRepository";
import { Worker } from "../../../workers/entities/worker";
import { User } from "../../../user/entities/user";


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
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
        ) {
    }

    async execute({id, name, password, is_admin, email, admin_id, worker_id}: IRequest): Promise<User> {

        // is_admin =  valor admin do form

        if(admin_id === ""){
            throw new AppError("Usuário invalido", 400)
            
        }

        if(!id || id === undefined || id === "") throw new AppError("Usuario nao encontrado", 400)

        //se bate o nome
        if((!name || name === undefined) || name.match(/([^A-Za-z0-9ãõç\s])/g) || name.length < 3){
            throw new AppError("Forneça um nome de usuário valido", 400)
        }

        //se bate o email
        if((!email || email === undefined) || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("Forneça um email valido", 400)
        }

        
        //se tem usuarios com o mesmo email ou nome
        const foundUsers = await this.usersRepository.findByNameOrEmail(name, email)
        
        

        if (foundUsers.filter(user => user.id !== id ).length) { // se tiver encontrado um user com id diferente do que esta sendo editado
            
            throw new AppError("Esse usuário ja existe", 400)
        
        }

        //pega o user correto

        
        const user = await this.usersRepository.findById(id)
        const admin_user = instanceToPlain(await this.usersRepository.findById(admin_id)) as User

        if(!user){
            throw new AppError("Usuario nao encontrado.", 400)
        }

        if(!admin_user.admin){
            throw new AppError("Apenas admins podem acessar esse conteudo.", 400)

        }

        //se o user tentar alterar seu proprio admin
        if(user.admin && user.id === admin_user.id && is_admin !== "true"){

            //e for master
            if(admin_user.master){
                throw new AppError("O administrador master não pode remover seu status de admin.", 403)
            }

            throw new AppError("Não foi possível atualizar o Usuário. Somento o usuario master pode remover um status de admin.", 403)

        }

        //se o user que esta sendo alterado for admin e for diferente do user que esta alterando e o admin que esta alterando nao for master
        if(user.admin && user.id !== admin_user.id && !admin_user.master){

            throw new AppError("Voce nao pode editar o usuário de outro admin.", 403)
        }


        
        //se estiver alterando o propio user e a senha nao for valida
        if(user.id === admin_id && !validatePassword(password, user.salt, user.password_hash)){

            if(password){
                throw new AppError("Senha incorreta.", 400)

            }

            throw new AppError("Digite a sua senha para editar seu cadastro", 400)
        }


        let worker: Worker
        if(worker_id){

            worker = instanceToPlain(await this.workersRepository.findByIdWithRelations(worker_id)) as Worker

            if(worker.user && user.id !== worker.user.id){

                throw new AppError("Esse funcionário ja esta atribuido a um usuário.")
            }

            
        }


        user.name = name
        user.email = email
        user.admin = is_admin === "true" ? true : false  //se admin nao for marcado = false
        user.worker_id = worker_id || null
        user.worker = worker || null

        return instanceToPlain(await this.usersRepository.create({...user})) as User
    
    
    }
}

export { UpdateUserUseCase }