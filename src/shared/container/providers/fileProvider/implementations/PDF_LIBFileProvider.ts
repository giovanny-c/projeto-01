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


        const templatePNG = await doc.embedJpg(uint8Array) //poe o template no pdf

        const page = doc.addPage()

        page.setRotation(degrees(90))

        page.drawImage(templatePNG, { //"desenha" a imagem
            x: 390,
            y: 10,
            width: 800,
            height: 400,
            rotate: degrees(90)
        })

        //numero da doaçao
        page.drawText(data.donation_number.toString(), {
            x: 138,
            y: 160,
            rotate: degrees(90),
            color: rgb(0.95, 0.1, 0.1),
            size: 23

        })

        //valor numerico
        page.drawText(formatToBRL(data.donation_value as number).toString(), {
            x: 138,
            y: 550,
            rotate: degrees(90),

            size: 23,


        })

        //nome
        page.drawText(data.donor_name, {
            x: 164,
            y: 176,
            rotate: degrees(90),

            size: 23,


        })

        //valor por extenso
        page.drawText(extenso(data.donation_value as number, {mode: "currency", currency: { type: "BRL"}, locale:"br"}), {
            x: 213,
            y: 164,
            rotate: degrees(90),
            size: 23,
        })



        moment.locale("pt-br")
        //data do recibo 
        // telvez precise separar em 3 e fazer 3 draw diferente
        const date = moment(data.payed_at).format("DD MMMM YY")
        const [dia, mes, ano] = date.split(" ")

        page.drawText(dia, {
            x: 315,
            y: 415,
            rotate: degrees(90),

            size: 23,


        })
        page.drawText(mes, {
            x: 315,
            y: 500,
            rotate: degrees(90),

            size: 23,


        })
        page.drawText(ano, {
            x: 315,
            y: 707,
            rotate: degrees(90),

            size: 23,


        })

        //FALTA
        //employee name e assinatura do responsavel



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