


import {inject, injectable} from "tsyringe"
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { INgoRepository } from "../../repositories/INgoRepository";
import { AppError } from "../../../../shared/errors/AppError";
import * as fs from "fs"
import { INgosTemplateConfigRepository } from "../../repositories/INgosTemplateConfigRepository";
import validateFields from "./validateFields";
import { INGOtemplateConfig } from "../../../../shared/container/providers/fileProvider/INGOReceiptProvider";


interface IRequest{
    file: Express.Multer.File
    ngo_id: string
}

@injectable()
class UpdateNgoTemplateConfigUseCase {

    constructor(
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("NgoTemplateConfigRepository")
        private ngoTemplateConfigRepository: INgosTemplateConfigRepository
    ){}

    async execute({file, ngo_id}: IRequest){

       

        if(!file){
            throw new AppError("Arquivo não enviado", 400)
        }
        
        if(file.mimetype !== "application/json"){
            throw new AppError("Formato do arquivo invalido", 400)
        }

        const ngo = await this.ngoRepository.findById(ngo_id)

        if(!ngo){
            throw new AppError("Instituição não encontrada", 404)
        }

        
        try{

            //pega o arquivo do tmp e tranforma em buffer
            const json = await fs.promises.readFile(file.path, {
                encoding: "utf-8"
            })

            //verifica se tem todos os campos
            const config = JSON.parse(json) as INGOtemplateConfig
            
            const {error, value} = validateFields(config)

            // console.log(config.generate_receipt.base_y)
            // console.log(value.generate_receipt.base_y)
            if(error){
                throw new AppError(error, 400)
            }

            //update da no banco
            const ngoTemplateConfig = await this.ngoTemplateConfigRepository.findByNgoId(ngo_id)
            
            if(!ngoTemplateConfig){
                await this.ngoTemplateConfigRepository.save({ngo_id, configuration: json})

            }else{

                await this.ngoTemplateConfigRepository.save({...ngoTemplateConfig, configuration: json})
            }
            
            //deleta o arquivo do tmp
            fs.unlink(file.path, (err) =>{
                if(err) console.error(err)
            })
        
        }catch(err){

            fs.unlink(file.path, (err) =>{
                if(err) console.error(err)
            })

            console.error(err)
            throw new AppError(err.message || "Não foi possivel salvar o arquivo", err.statusCode || 500)

        }



    }

}

export{UpdateNgoTemplateConfigUseCase}