
interface IMailProvider {

    sendMail(to: string, from: string, subject, variables?: any, path?: string, body?: any, configuration?: any): Promise<void>

}

export { IMailProvider }