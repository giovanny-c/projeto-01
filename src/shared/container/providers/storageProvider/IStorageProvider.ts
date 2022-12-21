import { String } from "aws-sdk/clients/acm"

interface IFilePath {
    file: string,
    folder: string
}
interface IStorageProvider {
    save({ file, folder }: IFilePath): Promise<string>
    delete({ file, folder }: IFilePath): Promise<void>
}

export { IStorageProvider, IFilePath }