import * as nodemailer from "nodemailer"
import { Transporter } from "nodemailer"
import { info } from "pdfkit";

import { IMailProvider, ISendEmailRequest } from "../IMailProvider";



class GmailMailProvider implements IMailProvider{
    
    private mailer: Transporter

    constructor(){

        this.mailer = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_ACCOUNT as string,
                pass: process.env.GMAIL_ACCOUNT_PASSWORD as string
            }
        })

      
       
        this.mailer.verify().then(success => console.log("Connected to Gmail")).catch(console.error)
    
    }


    async sendMail({from, to, subject, body}: ISendEmailRequest): Promise<void> {
     
        this.mailer.sendMail({

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
        .catch(console.error)

    }

}

export {GmailMailProvider}