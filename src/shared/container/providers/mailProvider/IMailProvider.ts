

type attachment = {
    content: string //base64
    filename: string
    type: string // ex: "application/pdf"
    disposition: string //"attachment"
}

interface ISendEmailRequest {
    to: string
    from: string
    subject: string
    variables?: any
    path?: string 
    body?: {
        text?: string
        html?: string
        attachments?: attachment[]
    }
    configuration?: any
}


interface IMailProvider {

    sendMail(data: ISendEmailRequest): Promise<void>

}

export { IMailProvider , ISendEmailRequest}