import { String } from "aws-sdk/clients/acm"

interface IFilePath {
    file: string,
    folder: string
}
interface IStorageProvider {
    save({ file, folder }: IFilePath): Promise<string>
    saveFileReceipt(dir: string, file_name:string, file: Uint8Array ): Promise<void>
    saveFileBooklet(dir: string, file_name:string, file: Uint8Array ): Promise<void>
    delete({ file, folder }: IFilePath): Promise<void>
    deleteFile(dir: string, file_name: string): void
    getFile(dir: string, file_name: string, returnInBase64: boolean): Promise<Buffer | string | void>
    getFileStream(dir: string, file_name: string): string
    getFilesFromDir(dir: string): Promise<string[] | void>
}

export { IStorageProvider, IFilePath }