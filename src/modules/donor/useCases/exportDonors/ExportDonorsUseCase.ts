import { inject, injectable } from "tsyringe";
import stream from "stream"
import { AppError } from "../../../../shared/errors/AppError";
import { IXlsxParserProvider } from "../../../../shared/container/providers/xlsxParserProvider/IXlsxParserProvider";
import { IDonorsRepository } from "../../repositories/IDonorsRepository";
import { User } from "../../../user/entities/user";

interface IRequest {
    user: Partial<User>
}


@injectable()
class ExportDonorsUseCase {

    constructor(
        @inject("DonorsRepository")
        private donorsRepository: IDonorsRepository,
        @inject("XlsxParserProvider")
        private xlsxParserProvider: IXlsxParserProvider
    ){

    }

    async execute({user}: IRequest){


        try {

            if(!user.admin){
                throw new AppError("Apenas administradores podem exportar doadores", 401)
            }


            const donor_sheet = await Promise.all(
                (await this.donorsRepository.find()
                ).map( (donor) => {
                    
                    return {
                        
                        nome: donor.name,
                        email: donor.email,
                        telefone: donor.phone,
                        cadastro_de:  donor.worker.name,
                        criado_por: donor.user.name,
                    }
                })
            ).catch(error => { 
                console.error(error)
                throw new AppError("Erro ao procurar doadores", 500)
            })

            if(donor_sheet.length <= 0 ){
                throw new AppError("Nenhum doador encontrada.", 404)
            }
                

            const sheetName = "Doadores"
            const file_name = `Exportaçao_Doadores.xlsx`
            
            const file = this.xlsxParserProvider.objectToXlsx(donor_sheet, {dateNF: "dd/mm/yyyy"}, sheetName)
        
            

            return{ 
                file: stream.Readable.from(file),
                file_name
            }
                
        } catch (error) {

            
            throw new AppError(error.message || "Não foi posivel gerar o arquivo", error.statusCode || 500)
        }

    }




}

export {
    ExportDonorsUseCase
}