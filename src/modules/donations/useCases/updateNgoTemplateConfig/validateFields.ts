import { INGOtemplateConfig } from "../../../../shared/container/providers/fileProvider/INGOReceiptProvider"
import Joi from "joi"


export default function validateFields(data){

    

//trocar o app error por input error
    const schema = Joi.object({

       
        generate_receipt:{
            base_y: Joi.number().required().messages({
                "number.base": "Forneça um numero valido para o generate_receipt.base_y.",
                "number.empty": "Forneça um numero para o generate_receipt.base_y.",
                "any.required": "propriedade faltando: generate_receipt.base_y."
            }),
            generate_for_booklet:{
                page_height: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.generate_for_booklet.page_height.",
                    "number.empty": "Forneça um numero para o generate_receipt.generate_for_booklet.page_height.",
                    "any.required": "propriedade faltando: generate_receipt.generate_for_booklet.page_height."
                })
            },
            text_color: {
                color: {
                    r: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.text_color.color.r",
                        "number.empty": "Forneça um numero para o generate_receipt.text_color.color.r",
                        "any.required": "propriedade faltando: generate_receipt.text_color.color.r"
                    }),
                    g: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.text_color.color.g",
                        "number.empty": "Forneça um numero para o generate_receipt.text_color.color.g",
                        "any.required": "propriedade faltando: generate_receipt.text_color.color.g"
                    }),
                    b: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.text_color.color.b",
                        "number.empty": "Forneça um numero para o generate_receipt.text_color.color.b",
                        "any.required": "propriedade faltando: generate_receipt.text_color.color.b"
                    })
                }
            },
            draw_template: {
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_template.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_template.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_template.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_template.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_template.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_template.y."
                }),
                width: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_template.width.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_template.width.",
                    "any.required": "propriedade faltando: generate_receipt.draw_template.width."
                }),
                height: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_template.height.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_template.height.",
                    "any.required": "propriedade faltando: generate_receipt.draw_template.height."
                })
            },
            draw_sign: {
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_sign.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_sign.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_sign.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_sign.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_sign.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_sign.y."
                }),
                width: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_sign.width.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_sign.width.",
                    "any.required": "propriedade faltando: generate_receipt.draw_sign.width."
                }),
                height: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_sign.height.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_sign.height.",
                    "any.required": "propriedade faltando: generate_receipt.draw_sign.height."
                })
            },
            draw_donation_number: {
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_donation_number.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_donation_number.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_donation_number.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_donation_number.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_donation_number.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_donation_number.y."
                }),
                color: {
                        
                    r: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_donation_number.color.r",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_donation_number.color.r",
                        "any.required": "propriedade faltando: generate_receipt.draw_donation_number.color.r"
                    }),
                    g: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_donation_number.color.g",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_donation_number.color.g",
                        "any.required": "propriedade faltando: generate_receipt.draw_donation_number.color.g"
                    }),
                    b: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_donation_number.color.b",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_donation_number.color.b",
                        "any.required": "propriedade faltando: generate_receipt.draw_donation_number.color.b"
                    })
                },
                size: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_donation_number.size.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_donation_number.size.",
                    "any.required": "propriedade faltando: generate_receipt.draw_donation_number.size."
                }),
            },
            draw_value: {
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_value.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_value.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_value.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_value.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_value.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_value.y."
                }),
                size: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_value.size.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_value.size.",
                    "any.required": "propriedade faltando: generate_receipt.draw_value.size."
                }),
            },
            draw_name: {
                line_1: {
                    x: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_name.line_1.x.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_name.line_1.x.",
                        "any.required": "propriedade faltando: generate_receipt.draw_name.line_1.x."
                    }),
                    y: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_name.line_1.y.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_name.line_1.y.",
                        "any.required": "propriedade faltando: generate_receipt.draw_name.line_1.y."
                    }),
                    size: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_name.line_1.size.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_name.line_1.size.",
                        "any.required": "propriedade faltando: generate_receipt.draw_name.line_1.size."
                    }),
                },
                line_2: {
                    x: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_name.line_2.x.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_name.line_2.x.",
                        "any.required": "propriedade faltando: generate_receipt.draw_name.line_2.x."
                    }),
                    y: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_name.line_2.y.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_name.line_2.y.",
                        "any.required": "propriedade faltando: generate_receipt.draw_name.line_2.y."
                    }),
                    size: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_name.line_2.size.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_name.line_2.size.",
                        "any.required": "propriedade faltando: generate_receipt.draw_name.line_2.size."
                    }),
                }
            },
            draw_extense_value: {
                line_1: {
                    x: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_extense_value.line_1.x.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_extense_value.line_1.x.",
                        "any.required": "propriedade faltando: generate_receipt.draw_extense_value.line_1.x."
                    }),
                    y: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_extense_value.line_1.y.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_extense_value.line_1.y.",
                        "any.required": "propriedade faltando: generate_receipt.draw_extense_value.line_1.y."
                    }),
                    size: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_extense_value.line_1.size.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_extense_value.line_1.size.",
                        "any.required": "propriedade faltando: generate_receipt.draw_extense_value.line_1.size."
                    }),
                },
                line_2: {
                    x: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_extense_value.line_2.x.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_extense_value.line_2.x.",
                        "any.required": "propriedade faltando: generate_receipt.draw_extense_value.line_2.x."
                    }),
                    y: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_extense_value.line_2.y.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_extense_value.line_2.y.",
                        "any.required": "propriedade faltando: generate_receipt.draw_extense_value.line_2.y."
                    }),
                    size: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_extense_value.line_2.size.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_extense_value.line_2.size.",
                        "any.required": "propriedade faltando: generate_receipt.draw_extense_value.line_2.size."
                    }),
                }
            },
            draw_day: {
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_day.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_day.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_day.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_day.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_day.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_day.y."
                }),
                size: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_day.size.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_day.size.",
                    "any.required": "propriedade faltando: generate_receipt.draw_day.size."
                }),
            },
            draw_month: {
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_month.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_month.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_month.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_month.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_month.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_month.y."
                }),
                size: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_month.size.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_month.size.",
                    "any.required": "propriedade faltando: generate_receipt.draw_month.size."
                }),
            },
            draw_year: {
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_year.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_year.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_year.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_year.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_year.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_year.y."
                }),
                size: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_year.size.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_year.size.",
                    "any.required": "propriedade faltando: generate_receipt.draw_year.size."
                }),
            },
            draw_reffering_to:{
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_reffering_to.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_reffering_to.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_reffering_to.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_reffering_to.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_reffering_to.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_reffering_to.y."
                }),
                size: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_reffering_to.size.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_reffering_to.size.",
                    "any.required": "propriedade faltando: generate_receipt.draw_reffering_to.size."
                }),
            },
            draw_worker: {
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_worker.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_worker.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_worker.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_worker.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_worker.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_worker.y."
                }),
                size: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_worker.size.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_worker.size.",
                    "any.required": "propriedade faltando: generate_receipt.draw_worker.size."
                }),
            },
            draw_canceled_donation:{
                x: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_canceled_donation.x.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_canceled_donation.x.",
                    "any.required": "propriedade faltando: generate_receipt.draw_canceled_donation.x."
                }),
                y: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_canceled_donation.y.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_canceled_donation.y.",
                    "any.required": "propriedade faltando: generate_receipt.draw_canceled_donation.y."
                }),
                rotate: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_canceled_donation.rotate.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_canceled_donation.rotate.",
                    "any.required": "propriedade faltando: generate_receipt.draw_canceled_donation.rotate."
                }), 
                size: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_canceled_donation.size.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_canceled_donation.size.",
                    "any.required": "propriedade faltando: generate_receipt.draw_canceled_donation.size."
                }),
            },
            draw_horizontal_line: {
                start: {
                    x: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.start.x.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.start.x.",
                        "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.start.x."
                    }),
                    y: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.start.y.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.start.y.",
                        "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.start.y."
                    }),
                },
                end: {
                    x: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.end.x.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.end.x.",
                        "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.end.x."
                    }),
                    y: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.end.y.",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.end.y.",
                        "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.end.y."
                    }),
                },
                color: {
                    r: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.color.r",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.color.r",
                        "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.color.r"
                    }),
                    g: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.color.g",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.color.g",
                        "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.color.g"
                    }),
                    b: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.color.b",
                        "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.color.b",
                        "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.color.b"
                    })
                },
                line_cap: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.line_cap.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.line_cap.",
                    "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.line_cap."
                }),
                thickness: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_receipt.draw_horizontal_line.thickness.",
                    "number.empty": "Forneça um numero para o generate_receipt.draw_horizontal_line.thickness.",
                    "any.required": "propriedade faltando: generate_receipt.draw_horizontal_line.thickness."
                })
            }



        },
        generate_booklet: {
            receipts_per_page: Joi.number().required().messages({
                "number.base": "Forneça um numero valido para o generate_booklet.receipts_per_page.",
                "number.empty": "Forneça um numero para o generate_booklet.receipts_per_page.",
                "any.required": "propriedade faltando: generate_booklet.receipts_per_page."
            }),
            draw_vertical_line: {
                start: {
                    x: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_booklet.draw_vertical_line.start.x",
                        "number.empty": "Forneça um numero para o generate_booklet.draw_vertical_line.start.x",
                        "any.required": "propriedade faltando: generate_booklet.draw_vertical_line.start.x"
                    })
                },
                end: {
                    x: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_booklet.draw_vertical_line.end.x",
                        "number.empty": "Forneça um numero para o generate_booklet.draw_vertical_line.end.x",
                        "any.required": "propriedade faltando: generate_booklet.draw_vertical_line.end.x"
                    })
                },
                color: {
                    r: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_booklet.draw_vertical_line.color.r",
                        "number.empty": "Forneça um numero para o generate_booklet.draw_vertical_line.color.r",
                        "any.required": "propriedade faltando: generate_booklet.draw_vertical_line.color.r"
                    }),
                    g: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_booklet.draw_vertical_line.color.g",
                        "number.empty": "Forneça um numero para o generate_booklet.draw_vertical_line.color.g",
                        "any.required": "propriedade faltando: generate_booklet.draw_vertical_line.color.g"
                    }),
                    b: Joi.number().required().messages({
                        "number.base": "Forneça um numero valido para o generate_booklet.draw_vertical_line.color.b",
                        "number.empty": "Forneça um numero para o generate_booklet.draw_vertical_line.color.b",
                        "any.required": "propriedade faltando: generate_booklet.draw_vertical_line.color.b"
                    })
                },
                line_cap: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_booklet.draw_vertical_line.line_cap",
                    "number.empty": "Forneça um numero para o generate_booklet.draw_vertical_line.line_cap",
                    "any.required": "propriedade faltando: generate_booklet.draw_vertical_line.line_cap"
                }),
                thickness: Joi.number().required().messages({
                    "number.base": "Forneça um numero valido para o generate_booklet.draw_vertical_line.thickness",
                    "number.empty": "Forneça um numero para o generate_booklet.draw_vertical_line.thickness",
                    "any.required": "propriedade faltando: generate_booklet.draw_vertical_line.thickness"
                })
            }
            
        },
      

        
        
    })


    const {error, value} = schema.validate(data, {convert: false})

    // if(error){
        // throw new InputError(error.details[0].message, value)  
    return {
        error: error?.details[0].message,
        value
    }
}
    // 