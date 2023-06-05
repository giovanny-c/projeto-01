import { inject, injectable } from "tsyringe";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import {parse as csvParse} from "csv-parse"
import * as fs from "fs"
import { AppError } from "../../../../shared/errors/AppError";
import { IXlsxParserProvider } from "../../../../shared/container/providers/xlsxParserProvider/IXlsxParserProvider";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import formatPhone from "../../../../../utils/formatPhone";

interface ICSVImportDonors{
    name: string
    email: string
    phone: string
}

interface IXLSXImportDonors{
    nome: string
    email: string
    telefone: string
    funcionario: string
}

interface IValidatedFields{
    name: string
    email: string
    phone: string
    worker_name: string
    worker_id: string
}


@injectable()
class ImportDonorsUseCase{
 
    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("XlsxParserProvider")
        private xlsxParserProvider: IXlsxParserProvider,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty
        ) { }

    async csvLoadDonors(file: Express.Multer.File): Promise<ICSVImportDonors[]>{

        
        
        return new Promise((resolve, reject) => {

            
 
            const stream = fs.createReadStream(file.path)

            const donors: ICSVImportDonors[] = []

            const parseFile = csvParse()

            stream.pipe(parseFile)

            parseFile.on("data", async(line) => {

               
                const [first_name, last_name, middle_name, ] = line
                
                let email = line.find( value => value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))//filtar até por qual.quer_e-mail@ser.edu.com.br
                let phone = line.find( value => value.match(/(\d\d )?(\d{4,5}-\d{4})/)) as string // filtra 11 99999-0000 
                
                
                if(phone){

                    phone = phone.replace(/(\+\d\d )/, "")//e tira o +55
                
                    phone = formatPhone(phone, false)
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

    async validateFieldsForXlsx(xlsxData: IXLSXImportDonors[]): Promise<IValidatedFields[]>{
        
        let foundWorkers = await this.workersRepository.find()



        const validatedFields = xlsxData.map(async(donor, index) => {


            //checka se falta alguma celula
            if(index === 0){
                
                let checkCols = [
                    "nome",
                    "email",
                    "telefone",
                    "funcionario"
                ]
                
                let sheetCols = Object.keys(donor)

                let missingCols = []

                checkCols.forEach(column =>{
                    
                    if(!sheetCols.includes(column)){
                        
                        missingCols.push(column)
                        
                    }
                    
                })
                
                if(missingCols.length > 0){
                    
                    if(missingCols.length > 1){
                        throw new AppError(`Adicione as seguintes colunas não encontradas: ${missingCols.join(", ")}`)
                    }

                    throw new AppError(`Adicione a seguinte coluna não encontrada: ${missingCols.join()}`)

                }
                

               
                
            }


        
            // if (!data.email) throw new AppError(`Please fill the email field at line ${object.indexOf(data) + 1}`, 400) //testar se o erro ta na linha certa
            if (!donor.telefone){
                
                throw new AppError(`Forneça um telefone para o doador, na linha ${index + 2}`, 400)
            } 
            if (!donor.funcionario) {
                
                throw new AppError(`Forneça o nome de um funcionário, na linha ${index + 2}`, 400)
            }
            if (!donor.email) {
                
                throw new AppError(`Forneça um email para o doador, na linha ${index + 2}`, 400)
            }
            if (!donor.nome) {
                throw new AppError(`Forneça um nome para o doador, na linha ${index + 2}`, 400)
            }

           
            //donor
            
            const donor_name = donor.nome.split(/\s/)//separa no espaço vazio
                .filter(string => string !== "" )//tira caracters vazio
                .map((string, index) => { //pega a primeira letra e transforma em upper

                //todas as palavras maiores que duas letras exeto dos. das. OU a primeira palavra
                if (string.match(/(?!das(?!\w+)|dos(?!\w+))\b\w{3,}/) || index === 0) {

                    // transforma a primeira letra em maiusculo
                    return string.replace(/^\w/, string.charAt(0).toUpperCase())

                }
                //retorna
                return string

            }).join(" ")

            if(!donor_name){

                throw new AppError(`Forneça um nome para o doador, na linha ${index + 2}`, 400)

            }

            

            let verifyEmail = donor.email.replace(/(^\s+)|(\s+$)/g, "").match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)//filtar até por qual.quer_e-mail@ser.edu.com.br

            if(!verifyEmail){
                throw new AppError(`Email inválido, na linha ${index + 2}`, 400)
            }

            //VALIDAR se ja existe email
            let [email] = verifyEmail
            
            const emailExists = await this.donorsRepository.findByEmail(email)
            
            if(emailExists){
                throw new AppError(`ja existe um doador cadastrado com esse Email, na linha ${index + 2}`, 400)

            }

            //phone
            let verifyPhone
            
            if(donor.telefone.toString().replace(/\D/g, "").length > 9){

                verifyPhone = donor.telefone.toString().replace(/(^\s+)|(\s+$)/g, "").match(/(((\(\d\d\))|(\d\d\s))(\d{4,5})(-)?(\d{4}))$/)
            
            }else{

                verifyPhone = donor.telefone.toString().replace(/(^\s+)|(\s+$)/g, "").match(/(\d{4,5})(-)?(\d{4})$/)

            }
             
            if(!verifyPhone){

                throw new AppError(`Telefone inválido, na linha ${index + 2}`, 400)
            }
                   

            let phone = verifyPhone[0]

            phone = formatPhone(phone, false)

            //worker
            const worker_name = donor.funcionario.replace(/(^\s+)|(\s+$)/g, "")

            const worker = foundWorkers.find(worker => worker.name === worker_name)

            if(!worker){
                throw new AppError(`Funcionário nao encontrado, na linha ${index + 2}`, 400)
            }

            //terminar os validates
            return {
                
                name: donor_name,
                email,
                phone,
                worker_name: worker_name,
                worker_id: worker.id,
                
            }

        })

        return await Promise.all(validatedFields)
    }

  

    async execute(file: Express.Multer.File , user_id: string){
//e colocar o import por .xlsx tbm
        if(!file) throw new AppError("Nenhum arquivo enviado")

        if(file.mimetype === "text/csv"){
            try {
            
            
        
            let donors = await this.csvLoadDonors(file)
       
            
        

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

        if(file.mimetype ===  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

            try {
                
                //lendo o arquivo
                const donors = this.xlsxParserProvider.xlsxToObject<IXLSXImportDonors>(file, {
                    parsingOptions: { cellDates: true },
                    xlsxToObjectOptions: { raw: true, dateNF: 'yyyy-mm-dd', defval: null}
                })
                
                //validate donors
                const v_donors = await this.validateFieldsForXlsx(donors)


                //process donors
                v_donors.forEach(async(donor) => {
                    
                    await this.donorsRepository.create({
                        email: donor.email,
                        name: donor.name,
                        phone: donor.phone,
                        worker_id: donor.worker_id,
                        user_id
                    })
                });


                //del after
                fs.unlink(file.path, (err)=> {
                    if (err) console.error(err)
                })

            return

            } catch (error) {
                console.error(error)

                fs.unlink(file.path, (err)=> {
                    if (err) console.error(err)
                })

                throw new AppError(error.message || "Não foi possivel ler o arquivo", error.statusCode || error.status || 500)
            }

        }

        throw new AppError("Não foi possivel ler o arquivo, tipo de arquivo inválido.", 400)

        
        
    }


}

export{ImportDonorsUseCase}