import { inject, injectable } from "tsyringe";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import {parse as csvParse} from "csv-parse"
import * as fs from "fs"
import { AppError } from "../../../../shared/errors/AppError";

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

                const [first_name, last_name, middle_name, ] = line
                
                let email = line.find( value => value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))//filtar até por qual.quer_e-mail@ser.edu.com.br
                let phone = line.find( value => value.match(/(\d\d )?(\d{4,5}-\d{4})/)) as string // filtra 11 99999-0000 
                
                if(phone){

                    phone = phone.replace(/(\+\d\d )/, "")//e tira o +55 no final
                }

                donors.push({
                    name: `${first_name} ${middle_name} ${last_name}`,
                    email,
                    phone: phone || ""
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

    async execute(file: Express.Multer.File , user_id: string){

        if(!file) throw new AppError("Nenhum arquivo enviado")
        
        const donors = await this.loadDonors(file)

        donors.map( async donor => {

            const {name, email, phone} = donor

            const donorExists = await this.donorsRepository.findByEmail(email)

            if(!donorExists){
                await this.donorsRepository.create({
                    name, email, phone, user_id
                })
            }

        })

        return
    }


}

export{ImportDonorsUseCase}