import { inject, injectable } from "tsyringe";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import {parse as csvParse} from "csv-parse"
import * as fs from "fs"

interface IImportDonors{
    name: string
    email: string
    phone: string
}

@injectable()
class ImportDonorsUseCase{
 
    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository) { }

    loadDonors(file: Express.Multer.File): Promise<IImportDonors[]>{

        return new Promise((resolve, reject) => {

            const stream = fs.createReadStream(file.path)

            const donors: IImportDonors[] = []

            const parseFile = csvParse()

            stream.pipe(parseFile)

            parseFile.on("data", async(line) => {

                const [name, email, phone] = line
            
                donors.push({
                    name,
                    email,
                    phone
                })

            }).on("end", () => {

                fs.promises.unlink(file.path)

                resolve(donors)

            }).on("error", (err) => {


                fs.promises.unlink(file.path)

                reject(err)

            })
        
        
        })


    }

    async execute(file: Express.Multer.File){
        
        const donors = await this.loadDonors(file)

        donors.map( async donor => {

            const {name, email, phone} = donor

            const donorExists = await this.donorsRepository.findByEmail(email)

            if(!donorExists){
                await this.donorsRepository.create({
                    name, email, phone
                })
            }

        })

        return
    }


}

export{ImportDonorsUseCase}