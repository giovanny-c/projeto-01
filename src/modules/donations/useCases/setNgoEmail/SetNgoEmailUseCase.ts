import { inject, injectable } from "tsyringe";
import { encrypt, validatePassword } from "../../../../utils/passwordUtils";

import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";

import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosEmailsRepository } from "../../repositories/INgosEmailRepository";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";


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
        private usersRepository: IUsersRepository,
        @inject("MailProvider")
        private mailProvider: IMailProvider,

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
        

        if(!ngo){
            throw new AppError("Instituição nao encontrada", 404)
        }


        const user = await this.usersRepository.findById(user_id)

        if(!user){
            throw new AppError("Usuario nao encontrado", 404)
        }

        //POR ENQUANTO SO O USER MESTRE PODE
        if(!user.master){
            throw new AppError("Apenas o admin master pode alterar o email da instituição", 404)

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

        //manda o email de teste 
        //manda um email para ele mesmo para testar testar
        try {
            await this.mailProvider.sendMail({
                service: service,
                from: email,
                password: password,
                to: [email, user.email],
                subject: "teste de email",
                body: {
                    text: "Email enviado para teste de atualização de email de instituição"
                }
                
            })
            
        } catch (error) {
            throw new AppError(error || error.message || "Erro ao atualizar email: Erro ao enviar o email de teste, confirme se o email e a senha estão corretos")
        }

        //, quando arrumar, tbm vai mandar um email de confirmação para o user master para vericar e confirmar que email de tal ngo foi alterado
        //tipo isso
        
        // service: process.env.BUSINESS_EMAIL_SERVICE ,
        // from: process.env.BUSINESS_EMAIL,
        // password: process.env.BUSINESS_EMAIL_PASSWORD,
        // to: user_master.email,
        // subject: ´Confirmação de alteração de email de instituição ${ngo.name}`,
        // body: {
        //     text: `O email da instituição ${ngo.name} foi alterado para ${email}. para confirmar clique aqui <a href= url da instituiçao >AQUI</a>`
        // }

        //PROBLEMA: se nao quiser confirmar, como voltar para o emial de antes sem utilizar 2 rows no banco?
        

        let encoded_password = encrypt(password)


        //se ja tiver o email e estiver dando update
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


        //se for a primeira vez
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