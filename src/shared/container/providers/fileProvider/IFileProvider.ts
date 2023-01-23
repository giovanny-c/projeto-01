import { PDFDocument, PDFFont, PDFImage } from "pdf-lib"
import { Donation } from "../../../../modules/donations/entities/donation"

interface ICreateBooletResponse{

    file: Uint8Array
    file_name: string
}


interface IFileProvider {

    generateFile(donation: Donation, saveFile: boolean): Promise<Uint8Array>
    createBooklet(data: Donation[]): Promise<ICreateBooletResponse>
    //generateReceiptForGrapecc(doc: PDFDocument, donation: Donation, saveFile: boolean, templatePng: PDFImage, font?: PDFFont): Promise<Uint8Array>

}

export { IFileProvider, ICreateBooletResponse }