



import { inject, injectable } from "tsyringe";
import { decrypt } from "../../../../utils/passwordUtils";
import ICacheProvider from "../../../../shared/container/providers/cacheProvider/ICacheProvider";
import { IFileProvider } from "../../../../shared/container/providers/fileProvider/IFileProvider";
import { IMailProvider } from "../../../../shared/container/providers/mailProvider/IMailProvider";

import { AppError } from "../../../../shared/errors/AppError";
import { IDonorsRepository } from "../../../donor/repositories/IDonorsRepository";
import { Ngo } from "../../entities/ngos";
import { IDonationsRepository } from "../../repositories/IDonationsRepository";

import { INgoRepository } from "../../repositories/INgoRepository";
import { INgosEmailsRepository } from "../../repositories/INgosEmailRepository";
import { INgosMessagesRepository } from "../../repositories/INgosMessagesRepository";
import { INgosTemplateConfigRepository } from "../../repositories/INgosTemplateConfigRepository";

import { socketHandler } from "../../../../app";


interface IRequest {
    donors_ids: string
    donation_id: string
    ngo_id: string
    message_id: string
    email: string
    user_id: string
    
}



@injectable()
class SendReceiptUseCase {


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
        @inject("FileProvider")
        private fileProvider: IFileProvider,
        @inject("NgoTemplateConfigRepository")
        private ngoTemplateConfigRepository: INgosTemplateConfigRepository
        

    ) { }

    
    
    async execute({ ngo_id, donation_id, donors_ids, message_id, email, user_id}: IRequest) {

        if(!donors_ids && (!email || email === undefined) ) throw new AppError("Insira pelo menos um email")
        if(!message_id) throw new AppError("Escolha a mensagem do email")
        if(!ngo_id ) throw new AppError("Instituição não encontrada")
        if(!donation_id) throw new AppError("Doação não encontrada")                
        
        
        let ngo: Ngo = JSON.parse(await this.cacheProvider.get(`ngo-${ngo_id}`))

        if(!ngo || !ngo.id || ngo.template_name){
            ngo =  await this.ngoRepository.findById(ngo_id)

            if(!ngo) throw new AppError("Instituição não encontrada", 404)

        }

        if(!ngo) throw new AppError("Instituição não encontrada", 404)
        

        
        
        let donorsEmails: string[] = [] 

        if(donors_ids){
            //filtra os ids que vem todos juntos e não deixa vir valores duplicados com o Set
            let donors_ids_array = [...new Set(donors_ids.match(/[\w\d-]+(?=,)/g).map(donor_id => {

                if(donor_id === ""){
                    return
                }

                return donor_id

            }))];


            if(donors_ids_array.length === 1){
                const donor = await this.donorsRepository.findById(donors_ids_array[0])

                if(donor.send_by_message){

                    const donation = await this.donationsRepository.markMessageSentForDonation(donation_id)


// RETORNO DA MSG POR WHATSAPP
                    return {
                        ngo,
                        donation,
                        success: "Marcado como mensagem enviada por WhatsApp!"
                    }
                }

                donorsEmails.push(donor.email)
            }else{
                
            //tambem filtra os duplicados
            //    donors_ids_array.filter((value, index, self) => self.indexOf(value) === index)
            //separa na virgula
                donorsEmails = await Promise.all(donors_ids_array.map(async(donor_id) => {

                    const donor = await this.donorsRepository.findById(donor_id)
                
                    if(!donor){
                        return
                    }
                    
                    return donor.email
                    
                    
                
                }))  
            }
        }



        if(email){

            donorsEmails.push(email)
        }

        if(donorsEmails.length < 1) throw new AppError("Email não encontrado ou não existe")
        

        const donation = await this.donationsRepository.findOneById(donation_id)
        

        if(!donation) throw new AppError("Doação não encontrada ou não existe")
        if(donation.is_donation_canceled) throw new AppError("Não é possivel enviar um recibo de uma doação que foi cancelada")
        
        const ngo_emails = await this.ngosEmailsRepository.findAllfromNgo(ngo.id)
        
        if(!ngo_emails || !ngo_emails.length) throw new AppError("Email da instituição não encontrado ou não existe")


        const message = await this.ngosMessagesRepository.findById(message_id)
        
        if(!message) throw new AppError("Mensagem não encontrado ou não existe")


        const ngo_template_config = await this.ngoTemplateConfigRepository.findByNgoId(ngo_id)

        if(!ngo_template_config || !ngo_template_config.configuration) throw new AppError("Configuração do template do recibo não encontrado ou não existe")
        
        const config = JSON.parse(ngo_template_config.configuration)

        if(!ngo.template_name) throw new AppError("Template do recibo não encontrado ou não existe")




        // const {dia, mes , ano} = getFormatedDateForReceipt(donation.created_at)
        
        // let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`

        // let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`
        
       

        // //VAI MUDAR
        // //usar o fs.stat ou access en vez desse?
        // const receipt = await this.storageProvider.getFile(dir, file_name, false)

        // //se a file não existir cria ela na hora
        // if(!receipt){
            
        // }

        let file = await this.fileProvider.generateFile({
            donation, 
            saveFile: false,
            generateForBooklet: false,
            template_config: config,
            template_name: ngo.template_name
        })

        if(!file){
            throw new AppError("Erro ao gerar o arquivo", 500)
        }

        //sera que da pra passar o file direto para o attachment

        const attachment = {
            filename: `${donation.donor_name}.pdf`,
            content: Buffer.from(file) 
        }
        
         

        //sem await termina a função na hr,
        //com continua até enviar

        this.mailProvider.sendMail({
            service: ngo_emails[0].service,
            // host: ngo_emails[0].host,
            from: ngo_emails[0].email,
            password: decrypt(ngo_emails[0].password),
            to: donorsEmails,
            subject: message.subject,
            body: {
                text: message.message,
                attachments: [attachment]
                }
            }
            
        )
        .then(info => {
            
            socketHandler.to(user_id).emit("response", {success: true, message: `Email enviado para: ${donorsEmails.join(", ")}`})
        })
        .catch(error => {
            
            let error_message 
            if(error.responseCode >= 400 && error.responseCode <= 499){

                error_message = "Não foi possível enviar o email. Tente novamente em instantes."

            }
            if(error.responseCode >= 500 ){

                error_message = "Não foi possível enviar o email, Erro: " + `${error.Response}` 
                
                if(error.responseCode === 535){

                    error_message = "Não foi possível enviar o email. Credenciais incorretas, verifique se o email e a senha estão corretos."
                }

                //usar emit
            }
            
            setTimeout(()=> 
                socketHandler.to(user_id).emit("response", {success: false, message: error_message, fix: true})
                , 1500)
            
        })
    

        await this.donationsRepository.markEmailSentForDonation(donation.id)



        return {
            ngo,
            donation,
            success: "Email enviado!"
        }

        
        

       
    }
}

export { SendReceiptUseCase }