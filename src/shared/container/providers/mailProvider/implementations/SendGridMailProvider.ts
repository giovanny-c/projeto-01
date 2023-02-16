import sendGridMail from "@sendgrid/mail"
import { MailService } from "@sendgrid/mail/src/mail"
import { AppError } from "../../../../errors/AppError"
import { IMailProvider } from "../IMailProvider"


class SendGridMailProvider implements IMailProvider {

    private mailer: MailService

    constructor(){
        this.mailer = sendGridMail
        this.mailer.setApiKey(process.env.SENDGRID_API_KEY)
    }

    async sendMail(to: string, from: string, subject: any, variables?: any, path?: string, body?: any, configuration?: any): Promise<void>{

        try {
            await this.mailer.send({
                to,
                from,
                subject,
                text: body.text,
                attachments: body.attachments
            })
        } catch (error) {
            console.error(error)
            
            if(error.response){
                console.error(error.response.body)
            }

            throw new AppError("Nao foi possivel enviar o email", 500)
        }
        

    }
}


export {SendGridMailProvider}