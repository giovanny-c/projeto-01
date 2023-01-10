import { PDFDocument, PrintScaling, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"
import fs from "fs"


import { IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";

import formatToBRL from "../../../../../../utils/formatToBRL";
import extenso from "extenso"
import moment from "moment"




class PDF_LIBFileProvider implements IFileProvider {

    async createFile(templatePath: string, data: Donation) {

        const doc = await PDFDocument.create()

        doc.catalog.getOrCreateViewerPreferences().setPrintScaling(PrintScaling.AppDefault)

        doc.registerFontkit(fontkit)

        const fontBuffer = fs.readFileSync("./fonts/Roustel.ttf")

        const font = await doc.embedFont(fontBuffer)
        

        const uint8Array = fs.readFileSync(templatePath) // le o tamplate do recibo


        const templatePNG = await doc.embedJpg(uint8Array) //poe o template no pdf

        const page = doc.addPage()

        // page.setRotation(degrees(90))
        page.setSize( 800, 365 )

        page.drawImage(templatePNG, { //"desenha" a imagem
            y: 0,
            x: 40,
            width: 800, //*0.75?
            height: 365,//*0.75?
            // rotate: degrees(90)
        })

        //numero da doaçao
        page.drawText(data.donation_number.toString(), {
            y: 229,//*0.75?
            x: 200,//*0.75?
            // rotate: degrees(90),
            color: rgb(0.95, 0.1, 0.1),
            size: 23//*0.75?

        })


        let [ , valor] = formatToBRL(data.donation_value as number).toString().split("$")

        //valor numerico
        page.drawText(valor, {
            y: 230,
            x: 576,
            // rotate: degrees(90),

            size: 23,


        })

//"sas".
        let nomeArray: string[] = data.donor_name.match(/.{1,56}\b/g)
        if(font){
            nomeArray = data.donor_name.match(/.{1,63}\b/g)
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
        
        const date = moment(data.created_at).locale("pt-br").format("DD MMMM YY")
        const [dia, mes, ano] = date.split(" ")
        let mesUpper = mes.at(0).toUpperCase() + mes.substring(1)

        page.drawText(dia, {
            y: 70,
            x: 450,
            // rotate: degrees(90),

            size: 24,
            font,
            color: rgb(0.122, 0.160, 0.797)


        })

        page.drawText(mesUpper, {
            y: 70,
            x: 535,
            // rotate: degrees(90),

            size: 24,
            font,
            color: rgb(0.122, 0.160, 0.797)

        })
        page.drawText(ano, {
            y: 70,
            x: 739,
            // rotate: degrees(90),

            size: 24,
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

        page.scale(0.75, 0.75)

        const pdfBytes = await doc.save() //cria um array de bytes 

        //criar o pdf no dir
        //se mudar a estensao muda o arquivo?


       //const dir = resolve(__dirname, "..", "tmp", "receipts", "")
        
        let dir = `./tmp/receipts/${data.ngo.name}/${ano}/${mes}`
        let filename = `${data.donor_name}_${dia}_${data.donation_number}_${data.id}.pdf`

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        fs.writeFile(`${dir}/${filename}`, pdfBytes,
            (err) => {
                if (err) throw err
            }) 

        return pdfBytes
    }

    async createBead(data: Donation[]){

        const doc = await PDFDocument.create()

        //doc.catalog.getOrCreateViewerPreferences().setPrintScaling(PrintScaling.AppDefault)


        let pageIndex = 0
        let index = 1

        const promises = data.map(async(donation) => {
            //para pegar o arquivo
            

            const [dia, mes, ano] = moment(donation.created_at).locale("pt-br").format("DD MMMM YY").split(" ")
               
            let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
            let filename = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`

    // fazer error handling para arquivos que nao existirem
            
            const receitpPdf = fs.readFileSync(`${dir}/${filename}`)

            
    
            // sera que vai
            const [receipt] = await doc.embedPdf(receitpPdf, [0])
            // para pegar o arquivo fim //
              
            //se for 1 cria uma pagina
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
                width: page.getWidth() - 40
            })

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

        const pdf = await doc.save()


        //salva
        let dir = `./tmp/print/${data[0].ngo.name}`
        
        let filename = `${data[0].donation_number}__${data[data.length-1].donation_number}.pdf`
       
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        fs.writeFile(`${dir}/${filename}`, pdf,
            (err) => {
                if (err) throw err
            }) 

    }

}

export { PDF_LIBFileProvider }