import { degrees, PDFDocument, rgb } from "pdf-lib"
import fs from "fs"


import { IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";

import formatToBRL from "../../../../../../utils/formatToBRL";
import extenso from "extenso"
import moment from "moment"

import {resolve} from "path"
import { page } from "pdfkit";
import { height } from "pdfkit/js/page";


class PDF_LIBFileProvider implements IFileProvider {

    async createFile(templatePath: string, data: Donation) {

        const doc = await PDFDocument.create()

        const uint8Array = fs.readFileSync(templatePath) // le o tamplate do recibo


        const templatePNG = await doc.embedJpg(uint8Array) //poe o template no pdf

        const page = doc.addPage()

        // page.setRotation(degrees(90))
        page.setSize( 800, 365 )

        page.drawImage(templatePNG, { //"desenha" a imagem
            y: 0,
            x: 40,
            width: 800,
            height: 365,
            // rotate: degrees(90)
        })

        //numero da doaçao
        page.drawText(data.donation_number.toString(), {
            y: 229,
            x: 200,
            // rotate: degrees(90),
            color: rgb(0.95, 0.1, 0.1),
            size: 23

        })


        let [ , valor] = formatToBRL(data.donation_value as number).toString().split("$")

        //valor numerico
        page.drawText(valor, {
            y: 230,
            x: 576,
            // rotate: degrees(90),

            size: 23,


        })


        let nomeArray = data.donor_name.match(/.{1,56}\b/g)
        //nome
        page.drawText(nomeArray[0], {
            y: 207,
            x: 214,
            // rotate: degrees(90),

            size: 19,


        })

        if(nomeArray[1] && nomeArray[1].length){

            page.drawText(nomeArray[1], {
                y: 186,
                x: 93,
                // rotate: degrees(90),
    
                size: 19,
    
    
            })
        }

        //valor por extenso
        let valorPorExtenso = extenso(valor , {mode: "currency", currency: { type: "BRL"}, locale:"br"})
        let vpeArray
        
        if(valorPorExtenso.length >= 63){

            vpeArray = valorPorExtenso.match(/.{1,62}\b/g)

            //para separar com hifen (nao funcionou 100%)
            // if(!vpeArray[0].match(/[ ,]$|( e)$/) ) {
            //     vpeArray[0] = `${vpeArray[0]}-`
            //    console.log(vpeArray)
            
            page.drawText(vpeArray[0], {
            y: 161,
            x: 199,
            // rotate: degrees(90),
            size: 19,
            })

            page.drawText(vpeArray[1], {
                y: 139,
                x: 95,
                // rotate: degrees(90),
                size: 19,
            })
        }
        if(valorPorExtenso.length < 63){

            page.drawText(valorPorExtenso, {
                y: 161,
                x: 199,
                // rotate: degrees(90),
                size: 19,
                })
        }

       
        


        //data do recibo 
        
        const date = moment(data.created_at).locale("pt-br").format("DD MMMM YY")
        const [dia, mes, ano] = date.split(" ")

        page.drawText(dia, {
            y: 70,
            x: 450,
            // rotate: degrees(90),

            size: 21,


        })
        page.drawText(mes, {
            y: 70,
            x: 535,
            // rotate: degrees(90),

            size: 21,


        })
        page.drawText(ano, {
            y: 70,
            x: 739,
            // rotate: degrees(90),

            size: 21,


        })

        //FALTA
        //employee name e assinatura do responsavel

        let referingTo = "Doação" 
        page.drawText(referingTo, {

            y: 118,
            x: 195,
            size: 19
        })



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

        

        let pageIndex = 0
        let index = 1

        data.forEach(async (donation) => {
            //para pegar o arquivo
             
            

            const [dia, mes, ano] = moment(donation.created_at).locale("pt-br").format("DD MMMM YY").split(" ")
               
            let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
            let filename = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`

            // let dir = `./templates`
            // let filename = `grapecc_template.jpg`
            
            const receitpPdf = fs.readFileSync(`${dir}/${filename}`)
    
            // sera que vai
            const [receipt] = await doc.embedPdf(receitpPdf, [0])
            // para pegar o arquivo fim //
                
            //se for 1 cria uma pagina
            if(index === 1 ){
        
                  doc.addPage() 
                
            }
            
            
            //pega a pagina atual
            const page = doc.getPage(pageIndex)
            page.setSize(800, 1095)
            console.log(page)
            
            const y = 365 * (index - 1) //posição y

            //coloca a img no pdf
            page.drawPage(receipt, {
    
                y,
                x: 0,
                width: 800,
                height: 365,
                
            })

            
            //se chegar a 3 acabou a pagina 
            if(index === 3){
                index = index - 3  
                pageIndex ++
            }

            
            index ++

        });
        
        ////////////////////////////////
        // const [dia, mes, ano] = moment(data[0].created_at).locale("pt-br").format("DD MMMM YY").split(" ")
        // let _dir = `./tmp/receipts/${data[0].ngo.name}/${ano}/${mes}`
        // let _filename = `${data[0].donor_name}_${dia}_${data[0].donation_number}_${data[0].id}.pdf`

        // // let _dir = `./templates`
        // // let _filename = `grapecc_template.jpg`
        
        // const receitpPdf = fs.readFileSync(`${_dir}/${_filename}`)

        // // sera que vai
        // const [receipt] = await doc.embedPdf(receitpPdf, [0])

        // const page = doc.addPage()
        // page.setSize(800,1095)

        // page.drawPage(receipt, {
        //     y: 0,
        //     x: 0,
        //     width: 800,
        //     height: 365
        // })

        // page.drawPage(receipt, {
        //     y: 400,
        //     x: 0,
        //     width: 800,
        //     height: 365
        // })



//////////////////////////////////

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