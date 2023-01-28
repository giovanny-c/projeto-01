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

interface IRequest {
    file: Express.Multer.File
    user_id: string
    ngo_id: string
}

interface IImportDonation {
    valor: string
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

        let donations: IImportDonation[]

        const excelData = xlsx.readFile(file.path, { cellDates: true }) //diskstorage

        //pega o nome da primeira planilha
        //let sheet = Object.keys(excelData.Sheets)[0]
        
        //poe o conteudo da 1ª planilha em donations    
        donations = xlsx.utils.sheet_to_json(excelData.Sheets[0], { raw: false, dateNF: 'yyyy-mm-dd' }) as IImportDonation[]
        
        return donations

    }

    async validateFields(object: IImportDonation[]): Promise<void> {


        object.forEach(data => {

            // if (!data.email) throw new AppError(`Please fill the email field at line ${object.indexOf(data) + 1}`, 400) //testar se o erro ta na linha certa
            if (!data.valor) throw new AppError(`Please fill the donation_value field at line ${object.indexOf(data) + 1}`, 400)
            if (!data.funcionario) throw new AppError(`Please fill the worker_name field at line ${object.indexOf(data) + 1}`, 400)
            if (!data.doador) throw new AppError(`Please fill the donor_name field at line ${object.indexOf(data) + 1}`, 400)
            // if (!this.dateProviderRepository.isValidDate(data.created_at)) {
            //     throw new AppError(`Invalid date at payed_at on line: ${object.indexOf(data) + 1}`, 400)
            // }
          
        });

    }

    async proccessDonations(object: IImportDonation[], user_id: string, ngo_id): Promise<void | string> {

//////////////// TRABALHAR AQUI ///////////////
        

        this.validateFields(object)

        object.forEach(async (data): Promise<any> => {


            const created_at = this.dateProviderRepository.dateNow()
            //se tiver, converte a data de pagamento 
            const payed_at =  this.dateProviderRepository.dateNow()


          
            //procura worker
            let worker = await this.workersRepository.findByName(data.funcionario)
            // //se  nao existir, cria
            //melhor deixar null
            // if (!worker) {
            //     worker = await this.workersRepository.create(data.funcionario)
            // }


            try {
                let donationValue = +(data.valor.replace(/(?!\,+)[\D]/g,"").replace(/\,/,"."))
                let {donation_number} = await this.donationCounterRepository.findByNgoId(ngo_id)
                
                //CRIA A DONATION
                await this.donationsRepository.create({

                    donation_number,
                    donation_value: donationValue,
                    donor_name: data.doador,
                    user_id: user_id,
                    worker_id: worker.id,
                    created_at,
                    is_payed: true,
                    payed_at,
                    is_donation_canceled: false,
                    ngo_id

                })

                await this.donationCounterRepository.update(ngo_id, donation_number + 1, donation_number)

                

            } catch (err) {

                throw new AppError(`It was not possible to create donations. Error: ${err} | on: ${object.indexOf(data) + 1}`)
                //return `It was not possible to create donations. Error: ${err} | on: ${object.indexOf(data) + 1}`
            }

            //poe a data da ultima doaçao no donor se for paga
            // if (is_payed === true) {
            //     await this.donorsRepository.create({ id: donor.id, last_donation: data.payed_at })
            // }

        })



    }


    async execute({file, user_id ,ngo_id}: IRequest): Promise<any> {

        const ngoExistis = await this.ngoRepository.findById(ngo_id)

        if(!ngoExistis){
            throw new AppError("Essa instituiçao nao existe", 400)
        }

        const a = this.loadDonations(file)
console.log(a)
        // //vai fazer para cada donation
        // const result = await this.proccessDonations(this.loadDonations(file), user_id, ngo_id)

        // fs.unlinkSync(file.path)

        // return result


    }


}

export { ImportDonationsUseCase }