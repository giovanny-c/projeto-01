import { Donation } from "../../../../modules/donations/entities/donation"


interface IFileProvider {

    createFile(filePath: string, data?: Donation/*dataCallback: Function, endCallback: Function*/)

}

export { IFileProvider }