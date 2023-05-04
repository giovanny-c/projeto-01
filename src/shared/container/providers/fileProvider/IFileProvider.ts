import { PDFDocument, PDFFont, PDFImage } from "pdf-lib"
import { Donation } from "../../../../modules/donations/entities/donation"
import { ICreateBooklet, IGenerateFile } from "./dtos/IFileProviderDTOs"

interface ICreateBooletResponse{

    file: Uint8Array | string
    file_name: string
    // file_buffer?: string
}


interface IFileProvider {

    generateFile(data: IGenerateFile): Promise<Uint8Array | void>
    createBooklet(data: ICreateBooklet ): Promise<ICreateBooletResponse>

}

export { IFileProvider, ICreateBooletResponse }