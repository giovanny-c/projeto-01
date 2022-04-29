import { inject, injectable } from "tsyringe";



import * as xlsx from "xlsx"

import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

import { AppError } from "../../../../shared/errors/AppError";



interface IImportDonation {
    donation_value: number
    donation_number?: number,
    worker_name: string //worker
    donor_name: string
    email: string
    phone?: string
    created_at: Date
    is_payed: boolean
    payed_at?: Date
    is_canceled?: boolean
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
        private dateProviderRepository: IDateProvider
    ) {

    }

    loadDonations(file: Express.Multer.File) { //talvez tenha que ser asincrona

        const excelData = xlsx.readFile(file.path, { cellDates: true }) //diskstorage

        return Object.keys(excelData.Sheets).map(name => ({
            data: xlsx.utils.sheet_to_json(excelData.Sheets[name], { raw: false, dateNF: 'yyyy-mm-dd' }) as any,
        }))

    }

    proccessDonations(object: IImportDonation[], user_id: string): void {

        object.forEach(async (data): Promise<void> => {
            //Validação de campos
            //try {
            console.log(data)

            if (!data.email) throw new AppError(`Please fill de email field at line ${object.indexOf(data) + 1}`) //testar se o erro ta na linha certa
            if (!data.donation_value) throw new AppError(`Please fill de donation_value field at line ${object.indexOf(data) + 1}`) //testar se o erro ta na linha certa
            if (!data.created_at) throw new AppError(`Please fill de created_at field at line ${object.indexOf(data) + 1}`) //testar se o erro ta na linha certa
            if (!data.worker_name) throw new AppError(`Please fill de worker_name field at line ${object.indexOf(data) + 1}`) //testar se o erro ta na linha certa
            if (!data.donor_name) throw new AppError(`Please fill de donor_name field at line ${object.indexOf(data) + 1}`) //testar se o erro ta na linha certa
            if (!data.phone) throw new AppError(`Please fill de phone field at line ${object.indexOf(data) + 1}`) //testar se o erro ta na linha certa

            //Fazer para created_at tbm
            //ve se a data de pagamento é valida

            if (!this.dateProviderRepository.isValidDate(data.payed_at)) {
                throw new AppError(`Invalid date at payed_at on line: ${object.indexOf(data) + 1}`)
            }


            // //converte a data de pagamento 
            if (data.payed_at) this.dateProviderRepository.convertToDate(data.payed_at)


            // //PODE HAVER ERROS DE DIGITAÇAO NOS CAMPOS QUE CAUSEM A CRIAÇAO DE NOVOS DONOR E WORKERS
            // //procura donor
            let donor = await this.donorsRepository.findByEmail(data.email)
            //se nao existir, cria
            if (!donor) {
                donor = await this.donorsRepository.create({
                    name: data.donor_name,
                    email: data.email,
                    phone: data.phone
                })
            }

            // //procura worker
            // let worker = await this.workersRepository.findByName(data.worker_name)
            // //se  nao existir, cria
            // if (!worker) {
            //     worker = await this.workersRepository.create(data.worker_name)
            // }

            // try {
            //     //CRIA A DONATION
            //     await this.donationsRepository.create({

            //         donation_value: data.donation_value as number,
            //         donor_id: donor.id,
            //         user_id: user_id,
            //         //worker: worker.id, //criar relação worker na tabela donation
            //         //donation_number: data.donation_number // fazer outra estrategia p/ number (tirar auto generate)
            //         //created_at: data.created_at, // fazer validaçao de data
            //         is_payed: data.is_payed || false,
            //         //payed_at: data.payed_at || null, // fazer validaçao de data
            //         is_donation_canceled: data.is_canceled || false,


            //     })

            // } catch (err) {

            //     throw new AppError(`It was not possible to create donations. Error: ${err} | on: ${object.indexOf(data) + 1}`)

            // }

            // //poe a data da ultima doaçao no donor 
            // if (data.is_payed) {

            //     await this.donorsRepository.create({ id: donor.id, last_donation: data.payed_at })

            // }


            // } catch (err) {
            //     throw new AppError(err)
            // }


        })
    }


    async execute(file: Express.Multer.File, user_id: string): Promise<void> {

        let object: IImportDonation[]

        this.loadDonations(file).forEach((element) => {

            object = element.data //as IImportDonation[]
        })


        this.proccessDonations(object, user_id)

    }


}

export { ImportDonationsUseCase }