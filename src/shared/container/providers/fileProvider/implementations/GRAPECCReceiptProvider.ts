import { PDFDocument, PDFFont, PDFImage, rgb } from "pdf-lib"

import fs from "fs"



import { Donation } from "../../../../../modules/donations/entities/donation";

import formatToBRL from "../../../../../../utils/formatToBRL";
import extenso from "extenso"

import { getFormatedDateForReceipt } from "../../../../../../utils/splitDateForReceipt";

import { PDF_LIBFileProvider } from "./PDF_LIBFileProvider";
import { container } from "tsyringe";
import { INGOReceiptProvider } from "../INGOReceiptProvider";
import { LocalStorageProvider } from "../../storageProvider/implementations/LocalStorageProvider";


class GRAPECCReceiptProvider implements INGOReceiptProvider {
    
    
    
    async generateReceipt(doc: PDFDocument, donation: Donation, saveFile: boolean, templatePng: PDFImage, font?: PDFFont): Promise<Uint8Array>{
        
        const storageProvider = container.resolve(LocalStorageProvider)

        const page = doc.addPage()

        // page.setRotation(degrees(90))
        page.setSize( 800, 365 )

        page.drawImage(templatePng, { //"desenha" a imagem
            y: 0,
            x: 40,
            width: 800, //*0.75?
            height: 365,//*0.75?
            // rotate: degrees(90)
        })

        //numero da doaçao
        page.drawText(donation.donation_number.toString(), {
            y: 229,//*0.75?
            x: 200,//*0.75?
            // rotate: degrees(90),
            color: rgb(0.95, 0.1, 0.1),
            size: 23//*0.75?

        })


        let [ , valor] = formatToBRL(donation.donation_value as number).toString().split("$")

        //valor numerico
        page.drawText(valor, {
            y: 230,
            x: 576,
            // rotate: degrees(90),

            size: 30,
            font,
            color: rgb(0.122, 0.160, 0.797)

        })

//se terminar em a e i o u nao seguido de n m r s z o e

        let nomeArray: string[] = donation.donor_name.match(/.{1,56}\b/g)
        if(font){
            nomeArray = donation.donor_name.match(/.{1,56}\b/g)
        }
        //nome
        
        page.drawText(nomeArray[0], {
            y: 207,
            x: 214,
            // rotate: degrees(90),

            size: 23,
            // maxWidth: 560,
            // wordBreaks: [" ", "-"],
            // lineHeight: 21,
            font,
            color: rgb(0.122, 0.160, 0.797)
        })

        if(nomeArray[1] && nomeArray[1].length){

            page.drawText(nomeArray[1], {
                y: 186,
                x: 93,
                // rotate: degrees(90),
    
                size: 23,
                font,
                color: rgb(0.122, 0.160, 0.797)
    
            })
        }

        //valor por extenso
        let valorPorExtenso = extenso(valor , {mode: "currency", currency: { type: "BRL"}, locale:"br"})
        
        let vpeArray: string[] = valorPorExtenso.match(/.{1,63}\b/g)

        //para separar com hifen (nao funcionou 100%)
        // if(!vpeArray[0].match(/[ ,]$|( e)$/) ) {
        //     vpeArray[0] = `${vpeArray[0]}-`
        //    console.log(vpeArray)
        
        //primeira letra maiuscula
        
        vpeArray[0] = vpeArray[0].at(0).toUpperCase() + vpeArray[0].substring(1)

        page.drawText(vpeArray[0], {
        y: 161,
        x: 199,
        // rotate: degrees(90),
        size: 23,
        font,
        color: rgb(0.122, 0.160, 0.797)
        })

        if(vpeArray[1] && vpeArray[1].length){

            page.drawText(vpeArray[1], {
                y: 139,
                x: 95,
                // rotate: degrees(90),
                size: 23,
                font,
                color: rgb(0.122, 0.160, 0.797)
            })
        }


        //data do recibo 
        
        const {dia, mes, ano} = getFormatedDateForReceipt(donation.created_at)


        let mesUpper = mes.at(0).toUpperCase() + mes.substring(1)

        page.drawText(dia, {
            y: 70,
            x: 450,
            // rotate: degrees(90),

            size: 25,
            font,
            color: rgb(0.122, 0.160, 0.797)


        })

        page.drawText(mesUpper, {
            y: 70,
            x: 535,
            // rotate: degrees(90),

            size: 25,
            font,
            color: rgb(0.122, 0.160, 0.797)

        })
        page.drawText(ano, {
            y: 70,
            x: 739,
            // rotate: degrees(90),

            size: 25,
            font,
            color: rgb(0.122, 0.160, 0.797)

        })

        //FALTA
        //employee name e assinatura do responsavel

        let referingTo = "Doação" 
        page.drawText(referingTo, {

            y: 118,
            x: 195,
            size: 22,
            font,
            color: rgb(0.122, 0.160, 0.797)
        })

//workwe
        page.drawText(donation.worker.name, {
            y: 16,
            x: 95,
            size: 20,
            font,
            color: rgb(0.122, 0.160, 0.797)

        })

        if(donation.is_donation_canceled){

            page.drawText("CANCELADO", {
                y: page.getHeight() / 3,
                x: page.getWidth() - (page.getWidth() - 86),
                color: rgb(0.95, 0.1, 0.1),
                size: 110,

            })
        }

        page.scale(0.75, 0.75)

        const pdfBytes = await doc.save() //cria um array de bytes 

        //criar o pdf no dir
        //se mudar a estensao muda o arquivo?


       //const dir = resolve(__dirname, "..", "tmp", "receipts", "")
        
       if(saveFile){
        let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
        let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`

        await storageProvider.saveFileReceipt(dir, file_name, pdfBytes)
    }
    

        return pdfBytes
    }

    async createBooklet(doc: PDFDocument, data: Donation[]): Promise<Uint8Array>{

        const storageProvider = container.resolve(LocalStorageProvider)

        let pageIndex = 0
        let index = 1

        const promises = data.map(async(donation) => {
            //para pegar o arquivo
            

            const {dia, mes, ano} = getFormatedDateForReceipt(donation.created_at)
               
            let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
            let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`

    // fazer error handling para arquivos que nao existirem

            let receitpPdf: Uint8Array | ArrayBuffer

            try {
                receitpPdf = fs.readFileSync(`${dir}/${file_name}`)
            
            } catch (error) {
                
                if(error){

                    const fileProvider = new PDF_LIBFileProvider()
                    receitpPdf = await fileProvider.generateFile(donation, true)
                    
                 
                }
                
            }
    
            const [receipt] = await doc.embedPdf(receitpPdf, [0])
          
            if(index === 1){
        
                  doc.addPage()
                
            }
            
            //pega a pagina atual
            let page = doc.getPage(pageIndex)

            //page.setSize(receipt.width, receipt.height * 3)
            
            const y = page.getHeight() - receipt.height * index //posição y
            
            //coloca a img no pdf
            page.drawPage(receipt, {
    
                y,
                x: 0,
                width: page.getWidth() - 50
            })

            // if(donation.is_donation_canceled){

            //     page.drawText("CANCELADO", {
            //         y: y + receipt.height / 3,
            //         x: receipt.width - (receipt.width - 60),
            //         color: rgb(0.95, 0.1, 0.1),
            //         size: 74,
    
            //     })
            // }

            page.drawLine({
                start: {x:0 ,y: y + 0.5},
                end: {x:page.getWidth(), y: y + 0.5 },
                color: rgb(0.5, 0.5, 0.5),
                lineCap: 1,
                thickness: 0.1
            })

        
            //se chegar a 3 acabou a pagina 
            if(index === 3){
                index = index - 3  
                pageIndex ++
            
                
            }

            
            index ++

            return page
                
        })
 
     

        const pages = await Promise.all(promises)

        doc.embedPages(pages)

        const pdfBytes = await doc.save()

        //salva
        let dir = `./tmp/print/${data[0].ngo.name}`
        
        let file_name = `${data[0].donation_number}__${data[data.length-1].donation_number}.pdf`
    
        await storageProvider.saveFileReceipt(dir, file_name, pdfBytes)
            
        return pdfBytes


    }

} 

export {GRAPECCReceiptProvider}