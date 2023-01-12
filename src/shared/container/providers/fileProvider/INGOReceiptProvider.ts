import { PDFDocument, PDFFont, PDFImage } from "pdf-lib";
import { Donation } from "../../../../modules/donations/entities/donation";


interface INGOReceiptProvider {

    createRecipt(doc: PDFDocument, donation: Donation, saveFile: boolean, templatePng: PDFImage, font?: PDFFont): Promise<Uint8Array>
    creatBooklet(doc: PDFDocument, data: Donation[]): Promise<Uint8Array>
}

export {INGOReceiptProvider}