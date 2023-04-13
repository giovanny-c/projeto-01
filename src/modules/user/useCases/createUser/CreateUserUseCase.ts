import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { genPassword } from "../../../../../utils/passwordUtils";
import { instanceToPlain } from "class-transformer"
import { User } from "../../entities/user";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";

interface IRequest {
    name: string
    password: string
    confirm_password: string
    email: string
    is_admin: string
    worker_id?: string
}

@injectable()
class CreateUserUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("MailProvider")
        private mailProvider: IMailProvider,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
        ) {
    }

    async execute({ name, password, confirm_password, is_admin, email, worker_id}: IRequest): Promise<User> {

        
        


        if((!name || name === undefined) || !name.match(/([A-Za-z0-9ãõç]{3,})/g)){
            throw new AppError("Forneça um nome de usuário valido", 400)
        }

        if((!email || email === undefined) || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("Forneça um email valido", 400)
        }

        if ((!password || password === undefined) || !password.match(/([A-Za-z0-9ãõç\-.*&$#@!?=+_]{4,})/g)) {

            throw new AppError("Forneça um senha valida", 400)
        }

        if(password !== confirm_password){

            throw new AppError("A senha e a confirmação não combinam", 400)
        }


        const userAlreadyExists = await this.usersRepository.findByNameOrEmail(name, email)

        if (userAlreadyExists.length) {
            throw new AppError("Esse usuário ja existe", 400)
        }


        let worker
        if(worker_id){

            worker = instanceToPlain(await this.workersRepository.findByIdWithRelations(worker_id))

            if(worker.user){

                throw new AppError("Esse funcionário ja esta atribuido a um usuário.")
            }

        }

        //fazer um match password com o joi

        const {salt, hash} = genPassword(password)

        const user = await this.usersRepository.create({ 
            name, 
            password_hash: 
            hash, 
            salt, 
            email, 
            admin: is_admin === "true" ? true : false,  //se tiver marcado
            worker_id: worker_id || null,
            worker: worker || null
        })

        return instanceToPlain(user) as User
    }
}

export { CreateUserUseCase }