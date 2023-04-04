import { PDFDocument, PrintScaling } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import fs from "fs"
import * as fsPromises from "fs/promises"
import {resolve} from "path"
import { ICreateBooletResponse, IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";


import { AppError } from "../../../../errors/AppError";
import { GRAPECCReceiptProvider } from "./GRAPECCReceiptProvider";
import { container, InjectionToken, singleton } from "tsyringe";


const generateReceiptMethods = {

    GRAPECC: GRAPECCReceiptProvider,
    
    GOTA: "",
        
}
@singleton()
class PDF_LIBFileProvider implements IFileProvider {


    async generateFile(donation: Donation, saveFile: boolean): Promise<Uint8Array> {

        if (!donation.donation_number){
            throw new AppError("Doação nao encontrada", 404)
        }

        //pega o template
        const templatePath = `./templates/${donation.ngo.alias}_template.jpg` //template do recibo
        const signPath = resolve(".", "templates", "signs", "ricardo_sign3.png" )

        let uint8Array
        let uint8ArraySign 
        try {
            
            uint8Array = await fsPromises.readFile(templatePath)// le o tamplate do recibo
            uint8ArraySign = await fsPromises.readFile(signPath)

            if(!uint8Array || !uint8ArraySign){
                return 
            }

        } catch (error) {
            return
        }
        
        

        const doc = await PDFDocument.create()
        
        //config de impressao
        doc.catalog.getOrCreateViewerPreferences().setPrintScaling(PrintScaling.AppDefault)
        doc.setTitle(`${donation.donor_name}_${donation.donation_number}_${donation.ngo.name}`)
        

        //pega a fonte
        doc.registerFontkit(fontkit)
        
        const fontBuffer = await fsPromises.readFile("./fonts/Roustel.ttf")
        
        const font = await doc.embedFont(fontBuffer)
        
        
        const template = await doc.embedJpg(uint8Array) //poe o template no pdf
        const templateSign = await doc.embedPng(uint8ArraySign)

        //vai injetar o metodo de criação de pdf dinamicamente

        const provider: InjectionToken = generateReceiptMethods[donation.ngo.alias]   

        const receiptProvider = container.resolve(provider)  
    
        const pdfBytes = await receiptProvider.generateReceipt(doc, donation, saveFile, template, templateSign, font)
        
        return  pdfBytes

       
    }

    async createBooklet(data: Donation[], saveFile: boolean): Promise<ICreateBooletResponse> {

        if(!data[0].donation_number){
            
            throw new AppError("Doação nao encontrada", 404)
            
        }

        const doc = await PDFDocument.create()

        doc.setTitle(`${data[0].donation_number}__${data[data.length-1].donation_number}`)
        
        const provider: InjectionToken = generateReceiptMethods[data[0].ngo.alias]   

        const receiptProvider = container.resolve(provider)  

        
        return await receiptProvider.createBooklet(doc, data, saveFile)

        
    }


}


export { PDF_LIBFileProvider }