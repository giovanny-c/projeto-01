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
            const data = [
                {name: "Jonh", age: 25},
                {name: "Marie", age: 23},
                {name: "Annie", age: 22}
            ]
            
            const workSheets = xlsx.utils.json_to_sheet(data)

            const file = xlsx.writeXLSX({
                Sheets: workSheets,
                SheetNames: ["name", "age"],
            }, {
                type: "buffer"
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