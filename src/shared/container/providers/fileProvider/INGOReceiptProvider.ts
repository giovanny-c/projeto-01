import { PDFDocument, PDFFont, PDFImage } from "pdf-lib";
import { Donation } from "../../../../modules/donations/entities/donation";
import { ICreateBooletResponse } from "./IFileProvider";


interface INGOReceiptProvider {

    generateReceipt(doc: PDFDocument, donation: Donation, saveFile: boolean, templatePng: PDFImage, font?: PDFFont): Promise<Uint8Array>
    createBooklet(doc: PDFDocument, data: Donation[]): Promise<ICreateBooletResponse>
}

export {INGOReceiptProvider}