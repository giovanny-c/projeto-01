import { Attachment } from "nodemailer/lib/mailer"


type SendGridAttachment = {
    content: string //base64
    filename: string
    type?: string // ex: "application/pdf"
    disposition?: string //"attachment"
}

interface ISendEmailRequest {
    from: string
    to: string | string[]
    subject: string
    variables?: any
    path?: string 
    body?: {
        text?: string
        html?: string
        attachments?: Attachment[] | SendGridAttachment[]
    }
    configuration?: any
}


interface IMailProvider {

    sendMail(data: ISendEmailRequest): Promise<void>

}

export { IMailProvider , ISendEmailRequest, SendGridAttachment}