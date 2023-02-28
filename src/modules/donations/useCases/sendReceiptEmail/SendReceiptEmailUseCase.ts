



import { inject, injectable } from "tsyringe";
import { decodePasswordForEmail } from "../../../../../utils/passwordUtils";
import { getFormatedDateForReceipt } from "../../../../../utils/splitDateForReceipt";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosEmailsRepository } from "../../repositories/INgosEmailRepository";
import { INgosMessagesRepository } from "../../repositories/INgosMessagesRepository";


interface IRequest {
    donors_ids: string
    donation_id: string
    ngo_id: string
    message_id: string
    
    
}



@injectable()
class SendReceiptEmailUseCase {


    constructor(
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("NgosMessagesRepository")
        private ngosMessagesRepository: INgosMessagesRepository,
        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
        @inject("DonationsRepository")
        private donationsRepository: IDonationsRepository,
        @inject("NgosEmailsRepository")
        private ngosEmailsRepository: INgosEmailsRepository,
        @inject("MailProvider")
        private mailProvider: IMailProvider,
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("StorageProvider")
        private storageProvider: IStorageProvider
        
        

    ) { }

    async execute({ ngo_id, donation_id, donors_ids, message_id}: IRequest) {

        if(!donors_ids ) throw new AppError("Insira pelo menos um email")
        if(!message_id) throw new AppError("Escolha a mensagem do email")
        if(!ngo_id ) throw new AppError("Instituição nao encontrada")
        if(!donation_id) throw new AppError("Doação nao encontrada")

                
        
        let ngo: Ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }

        if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        

        //filtra os ids que vem todos juntos
        const donorsEmails = await Promise.all(donors_ids.match(/[\w\d-]+(?=,)/g).map(async(donor_id) => {

            if(donor_id === ""){
                return
            }

            const donor = await this.donorsRepository.findById(donor_id)
            
            if(!donor){
                return
            }

            return donor.email
        }))

        if(donorsEmails.length < 1) throw new AppError("Email nao encontrado ou nao existe")
        

        const donation = await this.donationsRepository.findOneById(donation_id)
        
        if(!donation) throw new AppError("Doação nao encontrada ou nao existe")

        
        const ngo_emails = await this.ngosEmailsRepository.findAllfromNgo(ngo.id)
        
        if(!ngo_emails) throw new AppError("Email nao encontrado ou nao existe")


        const message = await this.ngosMessagesRepository.findById(message_id)
        
        if(!message) throw new AppError("Mensagem nao encontrado ou nao existe")


        const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
        let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`

        let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`
        
       
        const receipt = await this.storageProvider.getFile(dir, file_name, false)

        if(!receipt) throw new AppError("Recibo nao encontrado ou nao existe")


        const attachment = {
            filename: `${donation.donor_name}.pdf`,
            path: `${dir}/${file_name}` //pega da raiz do app
        }
        
            
        await this.mailProvider.sendMail({
            service: ngo_emails[0].service,
            from: ngo_emails[0].email,
            password: decodePasswordForEmail(ngo_emails[0].password),
            to: donorsEmails,
            subject: message.subject,
            body: {
                text: message.message,
                attachments: [attachment]
            }
            
        })



        return {
            ngo,
            donation
        }

        
        

       
    }
}

export { SendReceiptEmailUseCase }