import IRequest from "./IRequestDTO";
import Joi from "joi"


export default function validateFields(data: Partial<IRequest>){

    const {donor_name, donation_value, worker_id, ngo_id, donation_date} = data

    
//trocar o app error por input error
    const schema = Joi.object({
        donor_name: Joi.string().min(1).regex(/[^\\\/:*?<>|",]/).required().messages({
            "string.base": "Forneça um nome valido para essa doação.",
            "string.empty": "Forneça um nome valido para essa doação.",
            "any.required": "Forneça um valor para o campo nome"
        }),
        donation_value: Joi.number().greater(0).precision(2).required().messages({
            "number.base": "Forneça um valor valido para essa doação.",
            "number.empty": "Forneça um valor para o campo valor",
            "number.greater": "Forneça um valor maior que zero para essa doação.",
            "any.required": "Forneça um valor para o campo valor"
        }),
        worker_id: Joi.string().uuid().required().messages({
            "string.base": "Forneça o nome de um funcionário valido para essa doação.",
            "string.empty": "Forneça o nome de um funcionário valido para essa doação.",
            "any.required": "Forneça um valor para o campo funcionário."
        }),
        donation_date: Joi.date().options({ convert: true }).messages({
            "date.base": "Forneça uma data valida para esse doação"
        }),
        ngo_id: Joi.string().uuid().required().messages({
            "string.base": "Instituição não encontrada.",
            "string.empty": "Instituição não encontrada.",
            "any.required": "Instituição não encontrada."
        }),
        

        
        
    })


    const {error, value} = schema.validate({
        donor_name,
        donation_value,
        worker_id,
        donation_date,
        ngo_id,
    },
    {convert: false}
    )

    // if(error){
        // throw new InputError(error.details[0].message, value)  
    return {
        error: error?.details[0].message,
        value
    }
    
    // }

}