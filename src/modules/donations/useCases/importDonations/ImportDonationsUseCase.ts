import { inject, injectable } from "tsyringe";

import fs from "fs"

import * as xlsx from "xlsx"

import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

import { AppError } from "../../../../shared/errors/AppError";
import { INgoRepository } from "../../repositories/INgoRepository";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { Ngo } from "../../entities/ngos";
import { getExecutionTime } from "../../../../../utils/decorators/executionTime";



interface IRequest {
    file: Express.Multer.File
    user_id: string
    ngo_id: string
}

interface IResponse {
   
    ngo: Ngo
}

interface IImportDonation {
    valor: number
    doador: string
    funcionario: string
    worker_id?: string
    data: Date
    
}


@injectable()
class ImportDonationsUseCase {

    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty,
        @inject("DayjsDateProvider")
        private dateProviderRepository: IDateProvider,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("DonationCounterRepository")
        private donationCounterRepository: IDonationCounterRepository,
    ) {

    }


    loadDonations(file: Express.Multer.File): IImportDonation[] { //talvez tenha que ser asincrona

    //file.path
        const excelData = xlsx.readFile(file.path, { cellDates: true }) //diskstorage

        //pega o nome da primeira planilha
        let sheet = Object.keys(excelData.Sheets)[0]

        //poe o conteudo da 1ª planilha em donations    
        //defval null necessario
        return xlsx.utils.sheet_to_json(excelData.Sheets[sheet], { raw: true, dateNF: 'yyyy-mm-dd', defval: null}) as IImportDonation[]
    
        //e se usar xlsx.stream.to_json??? 
        

        

    }

    async validateFields(data: IImportDonation[], file_path): Promise<IImportDonation[]>{

        let foundWorkers = await this.workersRepository.find()



        const validatedFields = data.map(async(donation, index) => {


            //checka se falta alguma celula
            //por do lado de fora como Object.keys(data[0]) ?
            if(index === 0){
                
                let checkCols = [
                    "doador",
                    "valor",
                    "funcionario",
                    "data"
                ]
                
                let sheetCols = Object.keys(donation)

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
            if (!donation.valor){
                fs.unlink(file_path, (err)=> {
                    if (err) console.error(err)
                })
                throw new AppError(`Forneça um valor para a doação, na linha ${index + 2}`, 400)
            } 
            if (!donation.funcionario) {
                fs.unlink(file_path, (err)=> {
                    if (err) console.error(err)
                })
                throw new AppError(`Forneça o nome de um funcionário, na linha ${index + 2}`, 400)
            }
            if (!donation.doador) {
                fs.unlink(file_path, (err)=> {
                    if (err) console.error(err)
                })

    
                throw new AppError(`Forneça um nome para o doador, na linha ${index + 2}`, 400)
            }

            //se for numero ou nao for uma data valida mas nao for nulo
            if (  typeof donation.data === "number" || (typeof donation.data !== "object" && !this.dateProviderRepository.isValidDate(donation.data)) ) {
                throw new AppError(`Forneça uma data valida, na linha: ${index + 2}`, 400)
            }

            //donor


            const donation_donor = donation.doador.split(/\s/)//separa no espaço vazio
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

            
           
            if(!donation_donor){

                throw new AppError(`Forneça um nome para o doador, na linha ${index + 2}`, 400)

            }


            // se o doador for espaços vazios


            //value
            const donation_value = +(donation.valor)
            
            if(typeof donation_value !== "number" || Number.isNaN(donation_value)){

                throw new AppError(`O campo valor precisa ser um numero, na linha ${index + 2}`, 400)

            }
            if(donation_value === 0){
                throw new AppError(`O valor tem que ser maior que 0, na linha ${index + 2}`, 400)
            }

            //worker
            const worker_name = donation.funcionario.replace(/\s+$/g, "")

            const worker = foundWorkers.find(worker => worker.name === worker_name)

            if(!worker){
                throw new AppError(`Funcionário nao encontrado, na linha ${index + 2}`, 400)
            }


            return {
                valor: donation_value,
                doador: donation_donor,
                funcionario: worker_name,
                worker_id: worker.id,
                data: donation.data
            }

        })

        return await Promise.all(validatedFields)
    }

    @getExecutionTime()
    async proccessDonations(donations: IImportDonation[], user_id: string, ngo_id, file_path: string): Promise<void | string> {
        

        const validatedDionations = await this.validateFields(donations, file_path)

            
        for (const donation of validatedDionations) {
            
        
            const created_at = donation.data || this.dateProviderRepository.dateNow()
         
            const payed_at =  this.dateProviderRepository.dateNow()
                    
            try {

                
                let {donation_number} = await this.donationCounterRepository.findByNgoId(ngo_id)
                
                //CRIA A DONATION
                await this.donationsRepository.create({

                    donation_number,
                    donation_value: donation.valor,
                    donor_name: donation.doador,
                    user_id: user_id,
                    worker_id: donation.worker_id || null,
                    created_at,
                    is_payed: true,
                    payed_at,
                    is_donation_canceled: false,
                    ngo_id

                })

                let new_donation_number = +(donation_number) + 1
                await this.donationCounterRepository.update(ngo_id, new_donation_number, donation_number)

                

            } catch (err) {

                
                console.error(err)
                throw new AppError(`Nao foi possivel importar doação. Na linha: ${donations.indexOf(donation) + 2}`)
                //return `It was not possible to create donations. Error: ${err} | on: ${object.indexOf(data) + 1}`
            }

            
        }
    }




    async execute({file, user_id ,ngo_id}: IRequest): Promise<IResponse> {

        if(!file) throw new AppError("Nenhum arquivo enviado")

        
        const ngoExistis = await this.ngoRepository.findById(ngo_id)

        if(!ngoExistis){
            fs.unlink(file.path, (err)=> {
                if (err) console.error(err)
            })
            throw new AppError("Essa instituiçao nao existe", 400)
        }
    
        try {
            await this.proccessDonations(this.loadDonations(file), user_id, ngo_id, file.path)
            
        } catch (error) {
            fs.unlink(file.path, (err)=> {
                    if (err) console.error(err)
                })
            
            throw new AppError(error.message, error.status)
        }


        fs.unlink(file.path, (err)=> {
            if (err) console.error(err)
        })

        return {
            ngo: ngoExistis
        }


    }


}

export { ImportDonationsUseCase }