import { PDFDocument, PDFFont, PDFImage } from "pdf-lib"
import { Donation } from "../../../../../modules/donations/entities/donation"


interface IGenerateReceipt {

    doc: PDFDocument
    donation: Donation
    template: PDFImage 
    templateSign: PDFImage  
    generateForBooklet?: boolean
    font?: PDFFont
    saveFile?: boolean

}

interface ICreateReceiptBooklet{
    doc: PDFDocument
    donations: Donation[]
    saveFile: boolean
}

export {IGenerateReceipt, ICreateReceiptBooklet}