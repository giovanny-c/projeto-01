import * as nodemailer from "nodemailer"
import { Transporter } from "nodemailer"
import { info } from "pdfkit";
import { getExecutionTime } from "../../../../../../utils/decorators/executionTime";
import { AppError } from "../../../../errors/AppError";

import { IMailProvider, ISendEmailRequest } from "../IMailProvider";



class MailProvider implements IMailProvider{
    
    

    @getExecutionTime()
    async sendMail({service, from, password, to, subject, body}: ISendEmailRequest): Promise<void> {

        const mailer = nodemailer.createTransport({
            service: service,
            auth: {
                user: from,
                pass: password
            }
        })

        //necessario?
        mailer.verify()
        .catch(error => { 
            console.error(error)
            //throw new AppError("Não foi possivel se conectar ao servidor do email ou não foi possivel enviar o email", 500)
        })
        
        //tranformar em async?

        
        mailer.sendMail({
                from,
                to,
                subject,
                text: body.text || null,
                html: body.html || null,
                attachments: body.attachments || null
            })   
        .then(info => {
                 console.log({info})
        }) 
        .catch(error => { 
            // mandar pra uma rota que 
            //vai pegar esse erro e salvar em algum lugar?
            console.error(error)
            
            //throw new AppError("Não foi possivel enviar o email", 500)
        })
    }

}

export {MailProvider}