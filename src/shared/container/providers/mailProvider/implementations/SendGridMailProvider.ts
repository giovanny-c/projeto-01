import sendGridMail from "@sendgrid/mail"
import { MailService } from "@sendgrid/mail/src/mail"
import { AppError } from "../../../../errors/AppError"
import { IMailProvider, ISendEmailRequest, SendGridAttachment } from "../IMailProvider"


class SendGridMailProvider implements IMailProvider {

    private mailer: MailService

    constructor(){
        this.mailer = sendGridMail
        this.mailer.setApiKey(process.env.SENDGRID_API_KEY)
    }

    async sendMail({to, from, subject, body}: ISendEmailRequest): Promise<void>{

        
      
            this.mailer.send({
                to,
                from,
                subject,
                text: body.text,
                html: body.html || undefined,
                attachments: body.attachments as SendGridAttachment[] || undefined 
            
            }).catch(error => {
                console.error(error)
            
                if(error.response){
                    console.error(error.response.body)
                }

                throw new AppError("Nao foi possivel enviar o email", 500)
        
            })
        
            
        

    }



}



export {SendGridMailProvider}