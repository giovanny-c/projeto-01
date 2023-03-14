import { inject, injectable } from "tsyringe";
import { getFormatedDateForReceipt } from "../../../../../utils/splitDateForReceipt";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";
import { IWorkersReposiroty } from "../../../workers/repositories/IWorkersRepository";
import { ICreateDonationsDTO } from "../../dtos/ICreateDonationsDTO";
import { Donation } from "../../entities/donation";
import { Ngo } from "../../entities/ngos";
import { IDonationCounterRepository } from "../../repositories/IDonationCounterRepository";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";
import { INgoRepository } from "../../repositories/INgoRepository";

interface IRequest {
    ngo_id:string 
    donation_id: string
    donor_name: string
    worker_id:string 
    donation_value: number
    is_donation_canceled: string
}


interface IResponse {
    donation: Donation,
    ngo: Ngo
}



@injectable()
class UpdateDonationUseCase {


    constructor(
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,       
        @inject("WorkersRepository")
        private workersRepository: IWorkersReposiroty,      
        @inject("FileProvider")
        private fileProvider: IFileProvider,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
    ) { }



    async execute({ ngo_id, donor_name, worker_id, donation_value, is_donation_canceled, donation_id}: IRequest): Promise<IResponse> {

        if(!donation_id || donation_id === "") throw new AppError("Doação não encontrada")
       
        const workerExists = await this.workersRepository.findById(worker_id)

        if (!workerExists) {
            throw new AppError("Esse funcionario nao existe")

        } 

        let ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            
            ngo = await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        }


        const donation = await this.donationsRepository.findOneById(donation_id)

        if(!donation) throw new AppError("Doação não encontrada!")

        await this.donationsRepository.update({
            id: donation.id,
            worker_id, 
            donor_name,
            donation_value,
            is_donation_canceled: is_donation_canceled === "true" ? true : false
            
        })

        const updatedDonation = await this.donationsRepository.findOneById(donation.id)


        //se for salvar os recibos permanente
        if(donation.donor_name !== updatedDonation.donor_name 
            || donation.worker_id !== updatedDonation.worker_id 
            || donation.donation_value !== updatedDonation.donation_value 
            || donation.is_donation_canceled !== updatedDonation.is_donation_canceled ){

            const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
            let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`

            let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`
            
            try {
               //para deletar o antigo recibo
                this.storageProvider.deleteFile(dir, file_name) 
            } catch (error) {
                throw new AppError(error)
            }
            
        
            
            await this.fileProvider.generateFile(updatedDonation, true)
        }




        
        
        
           

        return  {
            ngo,
            donation: updatedDonation,
        }
        //mandar para uma rota para escolher o dono desse recibo, para mandar o email
        // mandar email do recibo no futuro
    }

}

export { UpdateDonationUseCase }