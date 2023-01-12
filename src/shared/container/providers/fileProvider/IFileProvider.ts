import { PDFDocument, PDFFont, PDFImage } from "pdf-lib"
import { Donation } from "../../../../modules/donations/entities/donation"


interface IFileProvider {

    createFile(donation: Donation, saveFile: boolean): Promise<Uint8Array>
    createBooklet(data: Donation[]): Promise<Uint8Array>
    createReciptForGrapecc(doc: PDFDocument, donation: Donation, saveFile: boolean, templatePng: PDFImage, font?: PDFFont): Promise<Uint8Array>
    saveReceipt(dir: string, file_name:string, file: Uint8Array ): void
    getFormatedDateForReceipt(date: Date)
}

export { IFileProvider }