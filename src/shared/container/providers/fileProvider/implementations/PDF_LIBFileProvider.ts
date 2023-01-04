import { degrees, PDFDocument, rgb } from "pdf-lib"
import fs from "fs"


import { IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";

import formatToBRL from "../../../../../../utils/formatToBRL";
import extenso from "extenso"
import moment from "moment"
import { float } from "aws-sdk/clients/lightsail";


class PDF_LIBFileProvider implements IFileProvider {

    async createFile(filePath: string, data?: Donation,) {

        const doc = await PDFDocument.create()

        const uint8Array = fs.readFileSync(filePath) // le o tamplate do recibo


        const templatePNG = await doc.embedJpg(uint8Array) //poe o template no pdf

        const page = doc.addPage()

        // page.setRotation(degrees(90))
        page.setSize( 800, 380 )

        page.drawImage(templatePNG, { //"desenha" a imagem
            y: 0,
            x: 50,
            width: 800,
            height: 380,
            // rotate: degrees(90)
        })

        //numero da doaçao
        page.drawText(data.donation_number.toString(), {
            y: 239,
            x: 200,
            // rotate: degrees(90),
            color: rgb(0.95, 0.1, 0.1),
            size: 23

        })


        let [ , valor] = formatToBRL(data.donation_value as number).toString().split("$")

        //valor numerico
        page.drawText(valor, {
            y: 239,
            x: 578,
            // rotate: degrees(90),

            size: 23,


        })


        let nomeArray = data.donor_name.match(/.{1,56}\b/g)
        //nome
        page.drawText(nomeArray[0], {
            y: 215,
            x: 216,
            // rotate: degrees(90),

            size: 20,


        })

        if(nomeArray[1] && nomeArray[1].length){

            page.drawText(nomeArray[1], {
                y: 193,
                x: 95,
                // rotate: degrees(90),
    
                size: 20,
    
    
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
            
            
        }

       
        page.drawText(vpeArray[0], {
            y: 168,
            x: 204,
            // rotate: degrees(90),
            size: 20,
        })

        page.drawText(vpeArray[1], {
            y: 146,
            x: 95,
            // rotate: degrees(90),
            size: 20,
        })


        //data do recibo 
        
        const date = moment(data.created_at).locale("pt-br").format("DD MMMM YY")
        const [dia, mes, ano] = date.split(" ")

        page.drawText(dia, {
            y: 73,
            x: 455,
            // rotate: degrees(90),

            size: 21,


        })
        page.drawText(mes, {
            y: 73,
            x: 540,
            // rotate: degrees(90),

            size: 21,


        })
        page.drawText(ano, {
            y: 73,
            x: 747,
            // rotate: degrees(90),

            size: 21,


        })

        //FALTA
        //employee name e assinatura do responsavel

        let referingTo = "Doação" 
        page.drawText(referingTo, {

            y: 123,
            x: 200,
            size: 20
        })



        const pdfBytes = await doc.save() //cria um array de bytes 

        //criar o pdf no dir
        //se mudar a estensao muda o arquivo?
        fs.writeFile(`./tmp/receipts/${data.ngo.name}_${mes}_${data.donor_name}_${data.donation_number}.pdf`, pdfBytes,
            (err) => {
                if (err) throw err
            }) 

        return pdfBytes
    }

}

export { PDF_LIBFileProvider }