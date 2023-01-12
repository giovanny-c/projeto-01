import { PDFDocument, PrintScaling } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import fs from "fs"


import { IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";


import { AppError } from "../../../../errors/AppError";
import { GRAPECCReceiptProvider } from "./GRAPECCReceiptProvider";


const createReceiptMethods = {

    GRAPECC: GRAPECCReceiptProvider,
    
    GOTA: "",
        
}

class PDF_LIBFileProvider implements IFileProvider {


    async createFile(donation: Donation, saveFile: boolean): Promise<Uint8Array> {

      
        if (!donation.donation_number){
            throw new AppError("Doação nao encontrada", 404)
        }
        
        const doc = await PDFDocument.create()
        
        //config de impressao
        doc.catalog.getOrCreateViewerPreferences().setPrintScaling(PrintScaling.AppDefault)
        
        //pega a fonte
        doc.registerFontkit(fontkit)
        
        const fontBuffer = fs.readFileSync("./fonts/Roustel.ttf")
        
        const font = await doc.embedFont(fontBuffer)
        
        //pega o template
        const templatePath = `./templates/${donation.ngo.name}_template.jpg` //template do recibo

        const uint8Array = fs.readFileSync(templatePath) // le o tamplate do recibo

        const templatePNG = await doc.embedJpg(uint8Array) //poe o template no pdf

        //vai chamar o metodo de criação de pdf dinamicamente

        const reciptProvider = new createReceiptMethods["GRAPECC"]
    
        const pdfBytes = await reciptProvider.createRecipt(doc, donation, saveFile, templatePNG, font)
        
        return  pdfBytes

       
    }

    async createBooklet(data: Donation[]): Promise<Uint8Array> {

        if(!data[0].donation_number){
            
            throw new AppError("Doação nao encontrada", 404)
            
        }

        const doc = await PDFDocument.create()

        const reciptProvider = new createReceiptMethods["GRAPECC"]

        const pdfBytes = await reciptProvider.creatBooklet(doc, data)

        return pdfBytes

        
    }


}


export { PDF_LIBFileProvider }