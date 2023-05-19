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

    async loadDonors(file: Express.Multer.File): Promise<IImportDonors[]>{

        
        
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
                    name: `${first_name} ${middle_name} ${last_name}`.trim(),
                    email: email?.toLowerCase() as string || null, //ver se consertou mais tarde
                    phone: phone || ""
                })

            }).on("end", () => {

                fs.promises.unlink(file.path)

                resolve(donors)

            }).on("error", (err) => {


                fs.promises.unlink(file.path)

                
                
                const error = {
                    message: err.message,
                    //  `Erro na linha ${err.message.match(/((?!lines: )\d+)/)}, coluna ${err.message.match(/((?!column: )\d+)/)}.`,
                    statusCode: 404
                }
                reject(error)
                
            })
        
        
        })


        
    }

    async execute(file: Express.Multer.File , user_id: string){
//e colocar o import por .xlsx tbm
        
        try {
            
            if(!file) throw new AppError("Nenhum arquivo enviado")
        
            let donors = await this.loadDonors(file)
       
            console.log(donors)
        

            donors.map( async donor => {

            
                const {name, email, phone} = donor

                if(!email){
                    return
                }

                const donorExists = await this.donorsRepository.findByEmail(email)

                //criar o donor se o email nao existir
                if(!donorExists){
                    await this.donorsRepository.create({
                        name, email, phone, user_id
                    })
                }

            })

        return
        
        } catch (error) {
                console.error(error)
                throw new AppError(error.message || "Não foi possivel ler o arquivo", error.statusCode || error.status || 500)
        }
        
    }


}

export{ImportDonorsUseCase}