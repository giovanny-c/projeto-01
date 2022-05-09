import { inject, injectable } from "tsyringe";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { v4 as uuidV4 } from "uuid"
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { resolve } from "path"

@injectable()
class SendForgotPasswordUseCase {


    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("MailProvider")
        private mailProvider: IMailProvider,
        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) { }

    async execute(user_name: string, email: string): Promise<void> {

        if (email != "giovanycast@hotmail.com") {
            throw new AppError("Invalid email")
        }

        //pega o template de email
        const templatePath = resolve(__dirname, "..", "..", "views", "emails", "forgotPassword.hbs")

        const user = await this.usersRepository.findByName(user_name)

        if (!user) {
            throw new AppError("This user does not exists")
        }

        const token = uuidV4()//token para validar o reset de senha 

        //cria um horario 3hrs a frente, validade do token
        //const expires_date = this.dateProvider.addOrSubtractTime("add", "hours", 3)

        //criar tabela para armazenar os tokens
        // await this.usersTokensRepository.create({
        //     refresh_token: token,
        //     user_id: user.id,
        //     expires_date,
        // })

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`
            //vai mandar para a rota de reset de password
        }

        await this.mailProvider.sendMail(
            email,
            "Recuperação de senha",
            variables,
            templatePath
        )
    }
}


export { SendForgotPasswordUseCase }