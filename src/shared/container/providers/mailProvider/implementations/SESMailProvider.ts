import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import * as fs from "fs"
import * as handlebars from "handlebars"
import { SES } from "aws-sdk"
import * as nodemailer from "nodemailer"
import { Transporter } from "nodemailer"

@injectable()
class SESMailProvider implements IMailProvider {

    private client: Transporter

    constructor() {
        this.client = nodemailer.createTransport({
            SES: new SES({
                apiVersion: "2010-12-01",
                region: process.env.AWS_REGION
            })
        })
    }

    async sendMail(to: string, subject: any, variables: any, path: string): Promise<void> {

        const templateFileContent = fs.readFileSync(path).toString("utf-8")

        const templateParse = handlebars.compile(templateFileContent)

        const templateHTML = templateParse(variables)

        await this.client.sendMail({
            to,
            from: "",//inserir email ja verificado pela aws aqui
            subject,
            html: templateHTML
        })
    }

}

export { SESMailProvider }