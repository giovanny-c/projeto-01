
import { ICreateBooletResponse } from "./IFileProvider";
import { ICreateReceiptBooklet, IGenerateReceipt } from "./dtos/IReceiptProviderDTOs";


interface INGOtemplateConfig {

    generate_receipt: {
        base_y: number,
        generate_for_booklet: {
            page_height: number
        },
        text_color: {
            color: {
                r: number,
                g: number,
                b: number
            }
        },
        draw_template: {
            y: number
            x: number
            width: number
            height: number
        },
        draw_sign: {
            y: number
            x: number
            width: number
            height: number
        },
        draw_donation_number: {
            y: number
            x: number
            color: {
                r: number
                g: number
                b: number
            },
            size: number
        },
        draw_value: {
            y: number
            x: number
            size: number
        },
        draw_name: {
            line_1: {
                y: number
                x: number
                size: number
            },
            line_2: {
                y: number
                x: number
                size: number
            }
        },
        draw_extense_value: {
            line_1: {
                y: number
                x: number
                size: number
            },
            line_2: {
                y: number
                x: number
                size: number
            }
        },
        draw_day: {
            y: number
            x: number
            size: number
        },
        draw_month: {
            y: number
            x: number
            size: number
        },
        draw_year: {
            y: number
            x: number
            size: number
        },
        draw_reffering_to: {
            y: number
            x: number
            size: number
        },
        draw_worker: {
            y: number
            x: number
            size: number
        },
        draw_canceled_donation: {
            y: number
            x: number
            rotate: number
            size: number
        },
        draw_horizontal_line: {
            start: {
                x: number
                y: number
            },
            end: {
                x: number
                y: number
            },
            color: {
                r: number
                g: number
                b: number
            },
            line_cap: number
            thickness: number
        }
    },
    generate_booklet: {
        receipts_per_page: number
        draw_vertical_line: {
            start: {
                x: number
            },
            end: {
                x: number
            },
            color: {
                r: number
                g: number
                b: number
            },
            line_cap: number
            thickness: number
        }
    }

}

interface INGOReceiptProvider {

    generateReceipt(data: IGenerateReceipt): Promise<Uint8Array>
    createBooklet(data: ICreateReceiptBooklet): Promise<ICreateBooletResponse>
}

export {INGOReceiptProvider, INGOtemplateConfig}