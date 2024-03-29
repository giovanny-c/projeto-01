import { String } from "aws-sdk/clients/acm"

interface IFilePath {
    file: string,
    folder: string
}
interface IStorageProvider {
    saveFromTmpFolder({ file, folder }: IFilePath): Promise<string>
    saveAsync(dir: string, file_name:string, file: Uint8Array ): void
    saveSync(dir: string, file_name:string, file: Uint8Array ): Promise<void>
    saveFileStream(dir: string, file_name: string, file: Uint8Array | Buffer)
    saveAndCompressFile(dir: string, file_name: string, readable: Uint8Array | Buffer)
    deleteFromTmpFolder({ file, folder }: IFilePath): Promise<void>
    deleteFile(dir: string, file_name: string): void
    getFile(dir: string, file_name: string, returnInBase64?: boolean): Promise<Buffer | string | void>
    getFileStream(dir: string, file_name: string): Promise<string>
    getFileNamesFromDir(dir: string): Promise<string[] | void>
}

export { IStorageProvider, IFilePath }