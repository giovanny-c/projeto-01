import * as nodemailer from "nodemailer"

import { IMailProvider, ISendEmailRequest } from "../IMailProvider";


import { socketHandler } from "../../../../../app";


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
  
            
            socketHandler.emit("response", {error: true, message:`Erro ao verificar o email: ${error.message || error }`})
            
            
            // throw new AppError(`Não foi possivel se conectar ao servidor do email ou não foi possivel enviar o email. Erro: ${error}`, 500)
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
            
            let emails = to
            if(Array.isArray(to)){
                emails = to.join(", ")
            }


                    
            socketHandler.emit("response", {success: true, message: `Email enviado para: ${emails}`})
               
            
        }) 
        .catch(error => { 

            socketHandler.emit("response", {error: true, message:`Erro ao enviar o email: ${error.message || error }`})

            // mandar pra uma rota que 
            //vai pegar esse erro e salvar em algum lugar?
            // throw new AppError(`Não foi possivel enviar o email. Erro: ${error}`, 500)
            
            //throw new AppError("Não foi possivel enviar o email", 500)
        })
    }

}

export {MailProvider}