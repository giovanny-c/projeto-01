import { String } from "aws-sdk/clients/acm"

interface IFilePath {
    file: string,
    folder: string
}
interface IStorageProvider {
    save({ file, folder }: IFilePath): Promise<string>
    delete({ file, folder }: IFilePath): Promise<void>
    getFile(dir: string, file_name: string, returnInBase64: boolean): Promise<Buffer | string | void>
    saveFileReceipt(dir: string, file_name:string, file: Uint8Array ): Promise<void>
    getFiles(dir: string): Promise<string[] | void>
}

export { IStorageProvider, IFilePath }