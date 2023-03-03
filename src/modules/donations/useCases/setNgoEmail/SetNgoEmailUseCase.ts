import { inject, injectable } from "tsyringe";
import { encrypt, validatePassword } from "../../../../../utils/passwordUtils";

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { DonationCounter } from "../../entities/donation_counter";

import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosEmailsRepository } from "../../repositories/INgosEmailRepository";


interface IRequest {
    ngo_id: string
    email: string
    password: string
    user_id: string
    user_password: string
}



@injectable()
class SetNgoEmailUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("NgosEmailsRepository")
        private ngosEmailsRepository: INgosEmailsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository

    ) { }

    async execute({ ngo_id, email, password, user_id, user_password}: IRequest) {

        if(!ngo_id){
            throw new AppError("Instituição nao encontrada", 400)
        }
        if(!email){
            throw new AppError("Forneça um email", 400)
        }
        if(!password){
            throw new AppError("Forneça uma senha", 400)
        }
        if(!user_password){
            throw new AppError("Forneça a senha de usuario", 400)
        }

        if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            throw new AppError("formato de Email invalido", 400)
        }


        const ngo =  await this.ngoRepository.findById(ngo_id)
        console.log(ngo)

        if(!ngo){
            throw new AppError("Instituição nao encontrada", 404)
        }


        const user = await this.usersRepository.findById(user_id)

        if(!user){
            throw new AppError("Usuario nao encontrado", 404)
        }

        if(!validatePassword(user_password, user.salt, user.password_hash)){
            throw new AppError("Senha de usuario incorreta", 400)
        }

        
        
        const emails = await this.ngosEmailsRepository.findAllfromNgo(ngo_id)

        if(emails.length > 1){
            throw new AppError("Não é possivel adicionar outro email para essa instituição", 400)
        }

        //nao precisa pois 2 instituiçoes pode ter o mesmo email
        // const emailExists = await this.ngosEmailsRepository.findByEmail(email)

        // if(emailExists){
        //     throw new AppError("Esse email ja existe", 400)

        // }

         
        //ex: pega apenas o hotmail de email@hotmail.com
        let service = email.match(/(?!\w+@)\w+/)[0]
        
        let encoded_password = encrypt(password)



        if(emails.length === 1){
    
            const newEmail = await this.ngosEmailsRepository.create({
                id: emails[0].id,
                ngo_id,
                email,
                password: encoded_password,
                service
            })

            return {
                email: newEmail,
                ngo
            }
        }   



        const newEmail = await this.ngosEmailsRepository.create({
            ngo_id,
            email,
            password: encoded_password,
            service
        })

    
        return {
            email: newEmail,
            ngo
        }
        
    
    }

}

export { SetNgoEmailUseCase }