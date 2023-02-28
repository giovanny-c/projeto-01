



import { inject, injectable } from "tsyringe";
import { decodePasswordForEmail } from "../../../../../utils/passwordUtils";
import { getFormatedDateForReceipt } from "../../../../../utils/splitDateForReceipt";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";

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
class SendReceipteEmailUseCase {


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
        private donorsRepository: IDonorsRepository
        
        

    ) { }

    async execute({ ngo_id, donation_id, donors_ids, message_id}: IRequest) {

        let ngo: Ngo = JSON.parse(await this.cacheProvider.getRedis(`ngo-${ngo_id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }

        if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        

        //usar esse match na hora de postar
        const filteredDonorIds = donors_ids.match(/[\w\d|-]+(?=,)/g)

        const donorsEmails = await Promise.all(filteredDonorIds.map(async(donor_id) => {

            const donor = await this.donorsRepository.findById(donor_id)

            return donor.email
        }))
        

        const donation = await this.donationsRepository.findOneById(donation_id)


        const ngo_emails = await this.ngosEmailsRepository.findAllfromNgo(ngo.id)

        const message = await this.ngosMessagesRepository.findById(message_id)


        const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
        let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`

        let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`
        
        const attachment = {
            filename: `${donation.donor_name}.pdf`,
            path: `${dir}/${file_name}` //pega da raiz do app
        }
        
            
        await this.mailProvider.sendMail({
            from: ngo_emails[0].email,
            password: decodePasswordForEmail(ngo_emails[0].password),
            to: donorsEmails,
            subject: message.subject,
            body: {
                text: message.message,
                attachments: [attachment]
            }
            
        })

        
        

       
    }
}

export { SendReceipteEmailUseCase }