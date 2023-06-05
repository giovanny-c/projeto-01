

import { inject, injectable } from "tsyringe";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";
import { genPassword } from "../../../../utils/passwordUtils";

interface IRequest {
    token: string
    email: string
    password: string
    password_confirmation: string
}

@injectable()
class ResetPasswordUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("MailProvider")
        private mailProvider: IMailProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository
    ) { }

    
    async execute({token, email, password, password_confirmation}: IRequest) {

        if (!email) {
            throw new AppError("Forneça um email")
        }
        if (!password) {
            throw new AppError("Forneça a nova senha")
        }
        if (!password_confirmation) {
            throw new AppError("Forneça a confirmação da senha")
        }
        if(password !== password_confirmation){
            throw new AppError("A senha e confirmação não combinam")
        }

       
        if(password.match(/([^A-Za-z0-9ãõç\-.*&$#@!?=+_])/g) || password.length < 4) {

            throw new AppError("Forneça um senha valida", 400)
        }

        
        const user = await this.usersRepository.findByEmail(email)
       
        if (!user) {
            throw new AppError("Usuario nao encontrado")
        }
        const confirmToken = await this.usersTokensRepository.findByUserIdAndRefreshToken({user_id: user.id, refresh_token: token})

        if(!confirmToken || token !== confirmToken.refresh_token){
            throw new AppError("Token invalido solicite um novo envio de email")
        }
        if(this.dateProvider.compareIfBefore(confirmToken.expires_date, this.dateProvider.dateNow())){
            throw new AppError("Token expirado solicite um novo envio de email")
        }

        const {hash, salt} = genPassword(password)

        await this.usersRepository.create({
            ...user,
            password_hash: hash,
            salt,
            
        })

        this.usersTokensRepository.deleteById(confirmToken.id)

        return {success: "Senha alterada com sucesso!"}
          
    }
}


export { ResetPasswordUseCase }