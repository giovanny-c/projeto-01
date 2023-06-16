import {inject, injectable} from "tsyringe"
import { IStorageProvider } from "../../../../shared/container/providers/storageProvider/IStorageProvider";
import { INgoRepository } from "../../repositories/INgoRepository";
import { AppError } from "../../../../shared/errors/AppError";
import * as fs from "fs"
import { IUsersRepository } from "../../../user/repositories/IUsersRepository";


interface IRequest{
    file: Express.Multer.File
    ngo_id: string
    admin_id: string
}

@injectable()
class UpdateNgoTemplateUseCase {

    constructor(
        @inject("StorageProvider")
        private storageProvider: IStorageProvider,
        @inject("NgoRepository")
        private ngoRepository: INgoRepository,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ){}

    async execute({file, ngo_id, admin_id}: IRequest){

       

        if(!file){
            throw new AppError("Arquivo não enviado", 400)
        }
        
        if(file.mimetype !== "image/jpeg"){
            throw new AppError("Formato do arquivo invalido", 400)
        }

        const ngo = await this.ngoRepository.findById(ngo_id)

        if(!ngo){
            throw new AppError("Instituição não encontrada", 404)
        }

        const user = await this.usersRepository.findById(admin_id)

        if(!user || !user.master){
            throw new AppError("Apenas o admin master pode atualizar o template da instituição", 403)
        }


        //novo nome 
        const template_name = `${ngo.alias}_template.jpg`
        
        try{

            //pega o arquivo do tmp e tranforma em buffer
            const fileBuffer = await fs.promises.readFile(file.path)
            
            //salva no /templates
            await this.storageProvider.saveSync("./templates", template_name , fileBuffer)
            
            //update da coluna no banco
            await this.ngoRepository.updateTemplate({ngo_id, template_name})
            
            //deleta o arquivo do tmp
            fs.unlink(file.path, (err) =>{
                if(err) console.error(err)
            })
        
        }catch(err){

            fs.unlink(file.path, (err) =>{
                if(err) console.error(err)
            })

            console.error(err)
            throw new AppError("Não foi possivel salvar o arquivo", 500)

        }



    }

}

export{UpdateNgoTemplateUseCase}