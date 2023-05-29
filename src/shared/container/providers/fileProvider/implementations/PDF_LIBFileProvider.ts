import { PDFDocument, PrintScaling } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import fs from "fs"
import * as fsPromises from "fs/promises"
import {resolve} from "path"
import { ICreateBooletResponse, IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";


import { AppError } from "../../../../errors/AppError";

import { container, InjectionToken, singleton } from "tsyringe";

import {GRAPECCReceiptProvider} from "./GRAPECCReceiptProvider" 
import { ICreateBooklet, IGenerateFile } from "../dtos/IFileProviderDTOs"

const generateReceiptMethods = {

    GRAPECC: GRAPECCReceiptProvider,
    
    GOTA: "GOTAReceiptProvider Nao implementado",
        
}

@singleton()
class PDF_LIBFileProvider implements IFileProvider {


    async generateFile({donation, generateForBooklet, saveFile}: IGenerateFile): Promise<Uint8Array> {

        if (!donation.donation_number){
            throw new AppError("Doação nao encontrada", 404)
        }

        //pega o template
        const templatePath = resolve(".", "templates", `${donation.ngo.alias}_template.jpg`) //template do recibo
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
    
        const pdfBytes = await receiptProvider.generateReceipt({
            doc, 
            donation, 
            saveFile, 
            template, 
            templateSign, 
            font,
            generateForBooklet
        })
        
        return  pdfBytes

       
    }


    async createBooklet({donations, saveFile}: ICreateBooklet): Promise<ICreateBooletResponse> {

        if(!donations.length){
            
            throw new AppError("Doação nao encontrada", 404)
            
        }

        const doc = await PDFDocument.create()

        doc.setTitle(`${donations[0].donation_number}__${donations[donations.length-1].donation_number}`)
        
        const provider: InjectionToken = generateReceiptMethods[donations[0].ngo.alias]   

        let receiptProvider
        
        try {
            
            receiptProvider = container.resolve(provider)     
            
        } catch (error) {
            throw new AppError("Metodo ainda não implementado!")   
        }
        
        
        return await receiptProvider.createBooklet({doc, donations, saveFile})

        
    }


}


export { PDF_LIBFileProvider }