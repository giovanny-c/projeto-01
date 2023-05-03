import { PDFDocument, PDFFont, PDFImage } from "pdf-lib";
import { Donation } from "../../../../modules/donations/entities/donation";
import { ICreateBooletResponse } from "./IFileProvider";


interface INGOReceiptProvider {

    generateReceiptForBooklet(doc: PDFDocument, donation: Donation, saveFile: boolean, template: PDFImage, templateSign: PDFImage,  font?: PDFFont): Promise<Uint8Array>
    generateReceipt(doc: PDFDocument, donation: Donation, saveFile: boolean, template: PDFImage, templateSign: PDFImage,  font?: PDFFont): Promise<Uint8Array>
    createBooklet(doc: PDFDocument, data: Donation[], saveFile: boolean): Promise<ICreateBooletResponse>
}

export {INGOReceiptProvider}