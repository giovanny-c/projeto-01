import * as nodemailer from "nodemailer"

import { IMailProvider, ISendEmailRequest } from "../IMailProvider";
import { AppError } from "@shared/errors/AppError";



class MailProvider implements IMailProvider{
    
    

    
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
            
            throw new AppError(`Não foi possivel se conectar ao servidor do email ou não foi possivel enviar o email. Erro: ${error}`, 500)
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
                 
        }) 
        .catch(error => { 
            // mandar pra uma rota que 
            //vai pegar esse erro e salvar em algum lugar?
            throw new AppError(`Não foi possivel enviar o email. Erro: ${error}`, 500)
            
            //throw new AppError("Não foi possivel enviar o email", 500)
        })
    }

}

export {MailProvider}