import upload from "@config/upload";
import { IFilePath, IStorageProvider } from "../IStorageProvider";
import * as fs from "fs"
import { resolve } from "path";

class StorageProviderInMemory implements IStorageProvider {

    async save({ file, folder }: IFilePath): Promise<string> {

        let dir = resolve(`${upload.tmpFolder}/${folder}`)
        let file_path = resolve(dir + `/${file}`)

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        fs.writeFileSync(file_path, "teste")

        return file_path

    }
    async delete({ file, folder }: IFilePath): Promise<void> {
        let file_path = resolve(`${upload.tmpFolder}/${folder}/${file}`)

        fs.unlinkSync(file_path)

    }

}

export { StorageProviderInMemory }