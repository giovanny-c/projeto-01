import { Donation } from "../../../../modules/donations/entities/donation"


interface IFileProvider {

    createFile(templatePath: string, data?: Donation/*dataCallback: Function, endCallback: Function*/)
    createBead()
}

export { IFileProvider }