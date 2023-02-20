import { inject, injectable } from "tsyringe";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { v4 as uuidV4 } from "uuid"
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import * as fsPromises from "fs/promises"

@injectable()
class SendForgotPasswordUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("MailProvider")
        private mailProvider: IMailProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) { }

    //user_name: string, email: string
    async execute(): Promise<void> {

        // if (!email) {
        //     throw new AppError("Forneça um email")
        // }

        // //pega o template de email
        // const templatePath = resolve(__dirname, "..", "..", "views", "emails", "forgotPassword.hbs")

        // const user = await this.usersRepository.findByName(user_name)

        // if (!user) {
        //     throw new AppError("Credenciais incorretas ou Usuario nao encontrado")
        // }

        const token = uuidV4()//token para validar o reset de senha 

        //cria um horario 3hrs a frente, validade do token
        //const expires_date = this.dateProvider.addOrSubtractTime("add", "hours", 3)

        //criar tabela para armazenar os tokens
        // await this.usersTokensRepository.create({
        //     refresh_token: token,
        //     user_id: user.id,
        //     expires_date,
        // })


        // const attachment = {
        //     filename: "recibo_.png",
        //     path: `./templates/recibo.png` //pega da raiz do app
        // }

        await this.mailProvider.sendMail({
            service: "",
            from: "",
            to: "",
            subject: "Recuperação de senha",
            body: {
                html: `Clique <a href="${process.env.FORGOT_MAIL_URL}${token}" target=_blank>AQUI</a> para recuperar seu email `,
                //attachments: [attachment]
            }
        })
    }
}


export { SendForgotPasswordUseCase }