import { PDFDocument, PDFFont, PDFImage } from "pdf-lib"
import { Donation } from "../../../../modules/donations/entities/donation"

interface ICreateBooletResponse{

    file: Uint8Array | string
    file_name: string
    // file_buffer?: string
}


interface IFileProvider {

    generateFile(donation: Donation, saveFile: boolean): Promise<Uint8Array | void>
    createBooklet(data: Donation[]): Promise<ICreateBooletResponse>
    //generateReceiptForGrapecc(doc: PDFDocument, donation: Donation, saveFile: boolean, templatePng: PDFImage, font?: PDFFont): Promise<Uint8Array>

}

export { IFileProvider, ICreateBooletResponse }