import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fs from "fs"
import { IFileProvider } from "../IFileProvider";
import { Donation } from "../../../../../modules/donations/entities/donation";



class PDF_LIBFileProvider implements IFileProvider {

    async createFile(filePath: string, data?: Donation) {

        const doc = await PDFDocument.create()

        const uint8Array = fs.readFileSync(filePath)


        const templatePNG = await doc.embedPng(uint8Array)
        const page = doc.addPage()

        page.setRotation(degrees(90))

        page.drawImage(templatePNG, {
            x: 500,
            y: 10,
            width: 800,
            height: 400,
            rotate: degrees(90)
        })

        page.drawText(data.id, {
            x: 100,
            y: 100,
            rotate: degrees(90)
        })


        const pdfBytes = await doc.save()

        //salva o pdf no dir
        fs.writeFile(`./tmp/receipts/recibo${data.donation_number}.pdf`, pdfBytes,
            (err) => {
                if (err) throw err
            })

    }

}

export { PDF_LIBFileProvider }