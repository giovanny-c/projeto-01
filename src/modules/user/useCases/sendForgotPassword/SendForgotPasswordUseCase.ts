import { inject, injectable } from "tsyringe";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { v4 as uuidV4 } from "uuid"
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import * as fsPromises from "fs/promises"
import { IUsersTokensRepository } from "../../repositories/IUsersTokensRepository";

@injectable()
class SendForgotPasswordUseCase {


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

    //user_name: string, email: string
    async execute(email: string) {

        if (!email) {
            throw new AppError("Forneça um email")
        }

        //pega o template de email
        // const templatePath = resolve(__dirname, "..", "..", "views", "emails", "forgotPassword.hbs")

        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new AppError("Usuario nao encontrado")
        }

        const token = uuidV4()//token para validar o reset de senha 

        //cria um horario 3hrs a frente, validade do token
        const expires_date = this.dateProvider.addOrSubtractTime("add", "hours", 3)

        
        const oldTokens = await this.usersTokensRepository.findByUserId(user.id)

        oldTokens.map((oldToken)=> {//nao precisa ser sincrono

            this.usersTokensRepository.deleteById(oldToken.id)
        })
        

        await this.usersTokensRepository.create({
            refresh_token: token,
            user_id: user.id,
            expires_date,
        })


        this.mailProvider.sendMail({
            service:  process.env.BUSINESS_EMAIL_SERVICE,
            from: process.env.BUSINESS_EMAIL,
            password: process.env.BUSINESS_EMAIL_PASSWORD,
            to: user.email,
            subject: "Recuperação de senha",
            body: {
                html: `Clique <a href="${process.env.RESET_PASSWORD_URL}${token}" target=_blank>AQUI</a> para redefinir sua senha `,
                //attachments: [attachment]
            }
        })

        return {
            success: "O link de recuperação de senha foi enviado para seu email"
        }
    }
}


export { SendForgotPasswordUseCase }