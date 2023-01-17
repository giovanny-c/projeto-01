import { PDFDocument, PrintScaling } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import fs from "fs"


import { IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";


import { AppError } from "../../../../errors/AppError";
import { GRAPECCReceiptProvider } from "./GRAPECCReceiptProvider";
import { container, InjectionToken } from "tsyringe";


const generateReceiptMethods = {

    GRAPECC: GRAPECCReceiptProvider,
    
    GOTA: "",
        
}

class PDF_LIBFileProvider implements IFileProvider {


    async generateFile(donation: Donation, saveFile: boolean): Promise<Uint8Array> {

      
        if (!donation.donation_number){
            throw new AppError("Doação nao encontrada", 404)
        }
        
        const doc = await PDFDocument.create()
        
        //config de impressao
        doc.catalog.getOrCreateViewerPreferences().setPrintScaling(PrintScaling.AppDefault)
        doc.setTitle(`${donation.donation_number}_${donation.donor_name}`)
        

        //pega a fonte
        doc.registerFontkit(fontkit)
        
        const fontBuffer = fs.readFileSync("./fonts/Roustel.ttf")
        
        const font = await doc.embedFont(fontBuffer)
        
        //pega o template
        const templatePath = `./templates/${donation.ngo.name}_template.jpg` //template do recibo

        const uint8Array = fs.readFileSync(templatePath) // le o tamplate do recibo

        const templatePNG = await doc.embedJpg(uint8Array) //poe o template no pdf

        //vai injetar o metodo de criação de pdf dinamicamente

        const provider: InjectionToken = generateReceiptMethods[donation.ngo.alias]   

        const receiptProvider = container.resolve(provider)  
    
        const pdfBytes = await receiptProvider.generateReceipt(doc, donation, saveFile, templatePNG, font)
        
        return  pdfBytes

       
    }

    async createBooklet(data: Donation[]): Promise<Uint8Array> {

        if(!data[0].donation_number){
            
            throw new AppError("Doação nao encontrada", 404)
            
        }

        const doc = await PDFDocument.create()

        doc.setTitle(`${data[0].donation_number}__${data[data.length-1].donation_number}`)
        
        const provider: InjectionToken = generateReceiptMethods[data[0].ngo.alias]   

        const receiptProvider = container.resolve(provider)  

        const pdfBytes = await receiptProvider.createBooklet(doc, data)

        return pdfBytes

        
    }


}


export { PDF_LIBFileProvider }