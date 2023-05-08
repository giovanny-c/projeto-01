import { createWriteStream } from "fs";
import { inject, injectable } from "tsyringe";
import * as xlsx from "xlsx"
import stream from "stream"


@injectable()
class ExportDonationsUseCase {

    constructor(){

    }

    async execute(){

        try {
            // const data = 
            
            const workSheet = xlsx.utils.json_to_sheet([
                {name: "Jonh", age: 25},
                {name: "Marie", age: 23},
                {name: "Annie", age: 22}
            ])

            const workBook = xlsx.utils.book_new()

            xlsx.utils.book_append_sheet(workBook, workSheet, "Donations")

            console.log(workBook)
            const file = xlsx.writeXLSX(
               workBook
                , {
                type: "buffer",
                bookType: "xlsx",
                
            }) as Buffer


            return stream.Readable.from(file)
                
        } catch (error) {
            console.error(error)
        }

    }




}

export {
    ExportDonationsUseCase
}