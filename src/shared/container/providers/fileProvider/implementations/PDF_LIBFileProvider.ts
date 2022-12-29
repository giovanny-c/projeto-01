import { degrees, PDFDocument, rgb } from "pdf-lib"
import fs from "fs"


import { IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";

import formatToBRL from "../../../../../../utils/formatToBRL";
import extenso from "extenso"
import moment from "moment"


class PDF_LIBFileProvider implements IFileProvider {

    async createFile(filePath: string, data?: Donation,) {

        const doc = await PDFDocument.create()

        const uint8Array = fs.readFileSync(filePath) // le o tamplate do recibo


        const templatePNG = await doc.embedPng(uint8Array) //poe o template no pdf

        const page = doc.addPage()

        page.setRotation(degrees(90))

        page.drawImage(templatePNG, { //"desenha" a imagem
            x: 500,
            y: 10,
            width: 800,
            height: 500,
            rotate: degrees(90)
        })

        //numero da doaçao
        page.drawText(data.donation_number.toString(), {
            x: 85,
            y: 350,
            rotate: degrees(90),
            color: rgb(0.95, 0.1, 0.1),
            size: 30

        })

        //valor numerico
        page.drawText(formatToBRL(data.donation_value as number).toString(), {
            x: 85,
            y: 570,
            rotate: degrees(90),

            size: 30,


        })

        //valor por extenso
        page.drawText(extenso(data.donation_value as number, {mode: "currency", currency: { type: "BRL"}, locale: "br"}), {
            x: 142,
            y: 280,
            rotate: degrees(90),
            size: 30,
        })

        //nome
        page.drawText(data.donor.name, {
            x: 142,
            y: 220,
            rotate: degrees(90),

            size: 30,


        })


        moment.locale("pt-br")
        //data do recibo 
        // telvez precise separar em 3 e fazer 3 draw diferente
        const date = moment(data.payed_at).format("D MMMM YYYY")
        const [dia, mes, ano] = date.split(" ")

        page.drawText(date, {
            x: 360,
            y: 110,
            rotate: degrees(90),

            size: 25,


        })



        const pdfBytes = await doc.save() //cria um array de bytes 

        //criar o pdf no dir
        fs.writeFile(`./tmp/receipts/${data.ngo.name}_${mes}_${data.donor_name}.pdf`, pdfBytes,
            (err) => {
                if (err) throw err
            }) 

        return pdfBytes
    }

}

export { PDF_LIBFileProvider }