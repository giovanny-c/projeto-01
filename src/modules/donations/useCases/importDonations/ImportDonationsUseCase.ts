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
        return  xlsx.utils.sheet_to_json(excelData.Sheets[sheet], { raw: true, dateNF: 'yyyy-mm-dd' }) as IImportDonation[]
        

    }

    validateFields(data: IImportDonation[], file_path): void {

        data.forEach((donation, index) => {
            
        
            // if (!data.email) throw new AppError(`Please fill the email field at line ${object.indexOf(data) + 1}`, 400) //testar se o erro ta na linha certa
            if (!donation.valor){
                fs.unlinkSync(file_path)
                throw new AppError(`Por favor preencha o campo valor, na linha ${index + 1}`, 400)
            } 
            if (!donation.funcionario) {
                fs.unlinkSync(file_path)
                throw new AppError(`Por favor preencha o campo funcionario, na linha ${index + 1}`, 400)
            }
            if (!donation.doador) {
                fs.unlinkSync(file_path)
                throw new AppError(`Por favor preencha o campo doador, na linha ${index + 1}`, 400)
            }
            // if (!this.dateProviderRepository.isValidDate(donation.created_at)) {
            //     throw new AppError(`Invalid date at payed_at on line: ${object.indexOf(donation) + 1}`, 400)
            // }
        })
    }

    @getExecutionTime()
    async proccessDonations(donations: IImportDonation[], user_id: string, ngo_id, file_path: string): Promise<void | string> {
        

        this.validateFields(donations, file_path)

        //ver qual e mais rapido
        //promise all ou
        //voltar para o for?
        //testar o map sem async await ?
        await Promise.all(donations.map(async(donation) => {
            
          
            const created_at = this.dateProviderRepository.dateNow()
         
            const payed_at =  this.dateProviderRepository.dateNow()
        
            //procura worker
            let worker = await this.workersRepository.findByName(donation.funcionario)

            
            // //se  nao existir, cria
            //melhor deixar null
            // if (!worker) {
            //     worker = await this.workersRepository.create(data.funcionario)
            // }
            
            //let donationValue = +(donation.valor.replace(/(?!\,+)[\D]/g,"").replace(/\,/,"."))
            
            try {

                
                let {donation_number} = await this.donationCounterRepository.findByNgoId(ngo_id)
                
                //CRIA A DONATION
                await this.donationsRepository.create({

                    donation_number,
                    donation_value: donation.valor,
                    donor_name: donation.doador,
                    user_id: user_id,
                    worker_id: worker.id,
                    created_at,
                    is_payed: true,
                    payed_at,
                    is_donation_canceled: false,
                    ngo_id

                })

                let new_donation_number = +(donation_number) + 1
                await this.donationCounterRepository.update(ngo_id, new_donation_number, donation_number)

                

            } catch (err) {
                fs.unlinkSync(file_path)
                throw new AppError(`It was not possible to create donations. Error: ${err} | on: ${donations.indexOf(donation) + 1}`)
                //return `It was not possible to create donations. Error: ${err} | on: ${object.indexOf(data) + 1}`
            }

            //poe a data da ultima doaçao no donor se for paga
            // if (is_payed === true) {
            //     await this.donorsRepository.create({ id: donor.id, last_donation: data.payed_at })
            // }
           
        }))
        

    }


    async execute({file, user_id ,ngo_id}: IRequest): Promise<IResponse> {

        
        const ngoExistis = await this.ngoRepository.findById(ngo_id)

        if(!ngoExistis){
            fs.unlinkSync(file.path)
            throw new AppError("Essa instituiçao nao existe", 400)
        }
    
        try {
            //vai fazer para cada donation
            await this.proccessDonations(this.loadDonations(file), user_id, ngo_id, file.path)

        } catch (error) {
            fs.unlinkSync(file.path)
            throw error
        }
        

        fs.unlinkSync(file.path)

        return {
            ngo: ngoExistis
        }


    }


}

export { ImportDonationsUseCase }