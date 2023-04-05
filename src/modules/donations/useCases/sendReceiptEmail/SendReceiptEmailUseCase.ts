



import { inject, injectable } from "tsyringe";
import { getExecutionTime } from "../../../../../utils/decorators/executionTime";
import { decrypt } from "../../../../../utils/passwordUtils";
import { getFormatedDateForReceipt } from "../../../../../utils/splitDateForReceipt";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IDateProvider } from "../../../../shared/container/providers/dateProvider/IDateProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
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
    email: string
    
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
        private storageProvider: IStorageProvider,
        @inject("FileProvider")
        private fileProvider: IFileProvider,
        
        

    ) { }

    @getExecutionTime()
    async execute({ ngo_id, donation_id, donors_ids, message_id, email}: IRequest) {

        if(!donors_ids && (!email || email === undefined) ) throw new AppError("Insira pelo menos um email")
        if(!message_id) throw new AppError("Escolha a mensagem do email")
        if(!ngo_id ) throw new AppError("Instituição nao encontrada")
        if(!donation_id) throw new AppError("Doação nao encontrada")                
        
        
        let ngo: Ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo.id){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição nao encontrada", 404)

        }

        if(!ngo) throw new AppError("Instituição nao encontrada", 404)
        

        //filtra os ids que vem todos juntos
        let donorsEmails: string[] = [] 

        if(donors_ids){

            donorsEmails = await Promise.all(donors_ids.match(/[\w\d-]+(?=,)/g).map(async(donor_id) => {

                if(donor_id === ""){
                    return
                }

                const donor = await this.donorsRepository.findById(donor_id)
                
                if(!donor){
                    return
                }

                return donor.email
            })) 
        }

        if(email){

            donorsEmails.push(email)
        }

        if(donorsEmails.length < 1) throw new AppError("Email nao encontrado ou nao existe")
        

        const donation = await this.donationsRepository.findOneById(donation_id)
        
        if(!donation) throw new AppError("Doação nao encontrada ou nao existe")
        if(donation.is_donation_canceled) throw new AppError("Não é possivel enviar um recibo de uma doação que foi cancelada")
        
        const ngo_emails = await this.ngosEmailsRepository.findAllfromNgo(ngo.id)
        
        if(!ngo_emails) throw new AppError("Email nao encontrado ou nao existe")


        const message = await this.ngosMessagesRepository.findById(message_id)
        
        if(!message) throw new AppError("Mensagem nao encontrado ou nao existe")


        // const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
        // let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`

        // let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`
        
       

        // //VAI MUDAR
        // //usar o fs.stat ou access en vez desse?
        // const receipt = await this.storageProvider.getFile(dir, file_name, false)

        // //se a file nao existir cria ela na hora
        // if(!receipt){
            
        // }

        let file = await this.fileProvider.generateFile(donation, false)

        if(!file){
            throw new AppError("Erro ao gerar o arquivo", 500)
        }

        //sera que da pra passar o file direto para o attachment

        const attachment = {
            filename: `${donation.donor_name}.pdf`,
            content: Buffer.from(file) 
        }
        
         

        this.mailProvider.sendMail({
            service: ngo_emails[0].service,
            from: ngo_emails[0].email,
            password: decrypt(ngo_emails[0].password),
            to: donorsEmails,
            subject: message.subject,
            body: {
                text: message.message,
                attachments: [attachment]
            }
            
        })

        await this.donationsRepository.markEmailSentForDonation(donation.id)



        return {
            ngo,
            donation,
            success: "Email enviado!"
        }

        
        

       
    }
}

export { SendReceiptEmailUseCase }