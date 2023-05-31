import { PDFDocument, PDFFont, PDFImage } from "pdf-lib"
import { Donation } from "../../../../../modules/donations/entities/donation"
import { INGOtemplateConfig } from "../INGOReceiptProvider"


interface IGenerateReceipt {

    doc: PDFDocument
    donation: Donation
    template: PDFImage 
    templateSign: PDFImage  
    template_config: INGOtemplateConfig
    generateForBooklet?: boolean
    font?: PDFFont
    saveFile?: boolean

}

interface ICreateReceiptBooklet{
    doc: PDFDocument
    donations: Donation[]
    saveFile?: boolean
    template_name: string
    template_config: INGOtemplateConfig
}

export {IGenerateReceipt, ICreateReceiptBooklet}