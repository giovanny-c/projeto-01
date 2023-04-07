import { InputError } from "../../../../shared/errors/InputError";
import IRequest from "./IRequestDTO";
import Joi from "joi"


export default function validateFields(data: Partial<IRequest>){

    const {donor_name, donation_value, worker_id, ngo_id, user_id} = data

//trocar o app error por input error
    const schema = Joi.object({

        donor_name: Joi.string().min(1).required().messages({
            "string.base": "Forneça um nome valido para essa doação.",
            "string.empty": "Forneça um nome valido para essa doação.",
            "any.required": "Forneça um valor para o campo nome"
        }),
        donation_value: Joi.number().precision(2).required().messages({
            "number.base": "Forneça um nome valido para essa doação.",
            "number.empty": "Forneça um valor para o campo valor",
            "any.required": "Forneça um valor para o campo valor"
        }),
        worker_id: Joi.string().uuid().required().messages({
            "string.base": "Forneça o nome de um funcionário valido para essa doação.",
            "string.empty": "Forneça o nome de um funcionário valido para essa doação.",
            "any.required": "Forneça um valor para o campo funcionário."
        }),
        ngo_id: Joi.string().uuid().required().messages({
            "string.base": "Instituição não encontrada.",
            "string.empty": "Instituição não encontrada.",
            "any.required": "Instituição não encontrada."
        }),
        user_id: Joi.string().uuid().required().messages({
            "string.base": "Usuário não encontrado.",
            "string.empty": "Usuário não encontrado.",
            "any.required": "Usuário não encontrado."
        }),
        
        //.error(new InputError("Forneça um nome valido para essa doação.", 400, "Valor inválido"))
    })


    const {error, value} = schema.validate({
        donor_name,
        donation_value,
        worker_id,
        ngo_id,
        user_id
    })

    if(error){
        throw new InputError(error.details[0].message, value)
    }

}