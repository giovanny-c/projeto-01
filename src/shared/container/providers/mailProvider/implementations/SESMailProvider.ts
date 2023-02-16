import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import * as fs from "fs"
import * as handlebars from "handlebars"
import { SES } from "aws-sdk"
import * as nodemailer from "nodemailer"
import { Transporter } from "nodemailer"

@injectable()
class SESMailProvider implements IMailProvider {

    private node_mailer_client: Transporter
    private ses_client: SES

    constructor() {

        this.node_mailer_client = nodemailer.createTransport({
            SES: new SES({
                apiVersion: "2010-12-01",
                region: process.env.AWS_REGION
            })
        })

        this.ses_client = new SES({
            region: process.env.AWS_REGION
        })
    }

    async sendMail(to: string, from: string, subject: any, variables?: any, path?: string, body?: any, configuration?: any): Promise<void> {
        
        let templateHTML
        
        if(path && variables){

            const templateFileContent = fs.readFileSync(path).toString("utf-8")
            
            const templateParse = handlebars.compile(templateFileContent)
            
            templateHTML = templateParse(variables)
        }

        await this.node_mailer_client.sendMail({
            to,
            from,//inserir email ja verificado pela aws aqui
            subject,
            html: templateHTML || null,
            text: body.text,
            attachments: [body.attachment] //pdf em base 64
        
        })
    }

    async SesSendMail(from: string, to: string, subject: any, body: any, configuration?: string){
        
        await this.ses_client.sendEmail({
            Source: from,
            Destination: {
                ToAddresses: [to],
            },
            Message: {
                Subject: {
                    Data: subject,
                },
                Body: {
                    Text: {
                        Data: body.text
                    },
                },
            
            },
            ConfigurationSetName: configuration
        }).promise()


       


    }

    //configuration = configuração do ses

}

export { SESMailProvider }