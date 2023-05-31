import { PDFDocument, PrintScaling } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import * as fsPromises from "fs/promises"
import {resolve} from "path"
import { ICreateBooletResponse, IFileProvider } from "../IFileProvider";


import { AppError } from "../../../../errors/AppError";

import { container, singleton } from "tsyringe";

import { ReceiptProvider} from "./ReceiptProvider" 
import { ICreateBooklet, IGenerateFile } from "../dtos/IFileProviderDTOs"

// const generateReceiptMethods = {

//     GRAPECC: GRAPECCReceiptProvider,
    
//     GOTA: "GOTAReceiptProvider Nao implementado",
        
// }

@singleton()
class PDF_LIBFileProvider implements IFileProvider {


    async generateFile({
        donation, 
        template_name,
        template_config,
        generateForBooklet, 
        saveFile, 
    }: IGenerateFile): Promise<Uint8Array> {

        
        if (!donation.donation_number){
            throw new AppError("Doação nao encontrada", 404)
        }

        //Pega o template e a assinatura
        const templatePath = resolve(".", "templates", template_name) //template do recibo
        const signPath = resolve(".", "templates", "signs", "ricardo_sign3.png" )

        let uint8Array
        let uint8ArraySign 

        try {  //ler arquivo
            uint8Array = await fsPromises.readFile(templatePath) 
        } catch (error) {
            throw new AppError("Arquivo de template não encontrado.", 500)
        }

        try {//ler assinatura
            uint8ArraySign = await fsPromises.readFile(signPath)
            
        } catch (error) {
            throw new AppError("Arquivo de assinatura não encontrado.", 500)
        }
        

        //cria o document
        const doc = await PDFDocument.create()
        
        //config de impressao
        doc.catalog.getOrCreateViewerPreferences().setPrintScaling(PrintScaling.AppDefault) //opçao de impresao padra do applicativo
        doc.setTitle(`${donation.donor_name}_${donation.donation_number}_${donation.ngo.name}`) // nome da impressao, não sei se esta usando
        

        //pega a fonte
        doc.registerFontkit(fontkit)
        //carrega o arquivo da fonte
        let fontBuffer
        
        try {
            fontBuffer = await fsPromises.readFile("./fonts/Roustel.ttf")
        } catch (error) {
            return
        }

        //embed a fonte no documento
        let font
        
        if(fontBuffer){
            font = await doc.embedFont(fontBuffer)
        }
        
        //embed do template e sign
        const template = await doc.embedJpg(uint8Array) 
        const templateSign = await doc.embedPng(uint8ArraySign)

        //vai injetar o metodo de criação de pdf dinamicamente
        // const provider: InjectionToken = generateReceiptMethods[donation.ngo.alias]   


        //chama o provider
        const receiptProvider = container.resolve(ReceiptProvider)  
    
        const pdfBytes = await receiptProvider.generateReceipt({
            doc, 
            donation, 
            saveFile, 
            template, 
            templateSign,
            template_config, 
            font,
            generateForBooklet,

        })
        
        return  pdfBytes

       
    }


    async createBooklet({
        donations, 
        saveFile, 
        template_name, 
        template_config
    }: ICreateBooklet): Promise<ICreateBooletResponse> {

        if(!donations.length){
            
            throw new AppError("Doação nao encontrada", 404)
            
        }

        const doc = await PDFDocument.create()
        doc.setTitle(`${donations[0].donation_number}__${donations[donations.length-1].donation_number}`)
        

        // const provider: InjectionToken = generateReceiptMethods[donations[0].ngo.alias]   
        // let receiptProvider
        // try {          
        //     receiptProvider = container.resolve(provider)      
        // } catch (error) {
        //     throw new AppError("Metodo ainda não implementado!")   
        // }

        const receiptProvider = container.resolve(ReceiptProvider)

        return await receiptProvider.createBooklet({
            doc, 
            donations, 
            saveFile, 
            template_name, 
            template_config})

        
    }


}


export { PDF_LIBFileProvider }