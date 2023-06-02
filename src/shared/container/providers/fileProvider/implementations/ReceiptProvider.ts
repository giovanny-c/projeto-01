import { degrees, rgb } from "pdf-lib";
import formatToBRL from "../../../../../../utils/formatToBRL";
import extenso from "extenso";
import { getFormatedDateForReceipt } from "../../../../../../utils/splitDateForReceipt";
import { PDF_LIBFileProvider } from "./PDF_LIBFileProvider";
import { container, singleton } from "tsyringe";
import { INGOReceiptProvider } from "../INGOReceiptProvider";
import { LocalStorageProvider } from "../../storageProvider/implementations/LocalStorageProvider";
import { DayjsDateProvider } from "../../dateProvider/implementations/DayjsDateProvider";
import { ICreateBooletResponse } from "../IFileProvider";
import { getExecutionTime } from "../../../../../../utils/decorators/executionTime";
import { ICreateReceiptBooklet, IGenerateReceipt } from "../dtos/IReceiptProviderDTOs";
import { AppError } from "../../../../errors/AppError";

import splitFor2Lines from "../../../../../../utils/splitFor2Lines";


@singleton()
class ReceiptProvider implements INGOReceiptProvider {

    async generateReceipt({
        doc, 
        donation, 
        saveFile, 
        generateForBooklet,
        font, 
        template, 
        templateSign, 
        template_config,
    }: IGenerateReceipt): Promise<Uint8Array> {

        
       //extrai todas as props de gen_receipt
        const { 
            draw_template, 
            draw_sign, 
            draw_donation_number, 
            draw_value,
            draw_extense_value,
            draw_name,
            draw_worker,
            draw_reffering_to,
            draw_canceled_donation,
            draw_day,
            draw_month,
            draw_year,
            draw_horizontal_line,
            base_y: config_base_y,
            generate_for_booklet,
            text_color
        } = template_config.generate_receipt

        //separa as cores
        const {r,g,b} = text_color.color

        //cria uma pagina no documento
        const page = doc.addPage();

        //default: x 595 | y 841
        
        //se for gerar recibo (gera numa folha 14 inteira)(o y conta de baixo(menor) para cima(maior))
        // numero base para calcular a posição
        let base_y = config_base_y
        
        //pega a largura da page
        const pageWidth = page.getWidth()

        //se for pra gerar para talao
        //a pagina vai ter ser do tamnho do recibo(na altura) (largura padrao A4)
        if(generateForBooklet){
            page.setSize(pageWidth, generate_for_booklet.page_height);

            base_y = 0 
        }

        //desenha template
        draw_template.y += base_y
        
        page.drawImage(template, {
            y: draw_template.y,
            x: draw_template.x,
            width: pageWidth - draw_template.width,
            height: draw_template.height
        });


        //desenha a assinatura
        draw_sign.y += base_y
        page.drawImage(templateSign, draw_sign);

        
        //numero da doaçao
        draw_donation_number.y += base_y
        let {r:dn_r, g: dn_g ,b: dn_b } = draw_donation_number.color

        page.drawText(donation.donation_number.toString(), {
            ...draw_donation_number,
            color: rgb(dn_r, dn_g, dn_b)
            ,
            
        });



        //valor numerico
        let [, valor] = formatToBRL(donation.donation_value as number).toString().split("$");

        draw_value.y += base_y
        page.drawText(valor, {
            ...draw_value,
            font,
            color: rgb(r, g, b)
        });


        //nome por extenso
        //se terminar em a e i o u nao seguido de n m r s z o e?
        //(\b\w+[áâãàÁÂÃÀéêÉÊíîÍÎóôõÓÔÕúûÚÛ]*) para dar match em álavras que terminan em
        //(.{1,50}\b\w+[áâãàÁÂÃÀéêÉÊíîÍÎóôõÓÔÕúûÚÛ]*) interessante!!
        // let nomeArray: string[] = donation.donor_name.match(/.{1,50}\b/g);


        //TESTAR MAIS
        //transformar essa func numa utils
        //por o line_1_lenght e line_2_lenght e  do name e value nas configs 
        
        const {line_1: name_line_1, line_2: name_line_2} = draw_name

        const {line_1_lenght: name_1_lh, line_2_lenght: name_2_lh} = draw_name.line_lenght

        const {first_line: first_name_line, second_line: second_name_line} = splitFor2Lines(donation.donor_name, name_1_lh, name_2_lh)
    

        //linha 1
        name_line_1.y += base_y
        page.drawText(first_name_line, {
            ...name_line_1,
            font,
            color: rgb(r, g, b)
            // maxWidth: 560,
            // wordBreaks: [" ", "-"],
            // lineHeight: 21,
        });

        //linha 2
        if (second_name_line.length) {
            name_line_2.y += base_y

            page.drawText(second_name_line, {
                ...name_line_2,
                font,
                color: rgb(r, g, b)
            });
        }

        //valor por extenso
        const {line_1: value_line_1, line_2: value_line_2} = draw_extense_value

        const {line_1_lenght: ev_1_lh, line_2_lenght: ev_2_lh} = draw_extense_value.line_lenght

        let valorPorExtenso = extenso(valor, { mode: "currency", currency: { type: "BRL" }, locale: "br" });

        valorPorExtenso = valorPorExtenso.at(0).toUpperCase() + valorPorExtenso.substring(1);

        const {first_line: first_value_line, second_line: second_value_line} = splitFor2Lines(valorPorExtenso, ev_1_lh, ev_2_lh)


        //linha 1
        value_line_1.y += base_y

        page.drawText(first_value_line, {
            ...value_line_1,
            font,
            color: rgb(r, g, b)
        });

        //linha 2
        if (second_value_line && second_value_line.length) {

            value_line_2.y += base_y

            page.drawText(second_value_line, {
                ...value_line_2,
                font,
                color: rgb(r, g, b)            
            });
        }


        //data do recibo 
        const { dia, mes, ano } = getFormatedDateForReceipt(donation.created_at);


        let mesUpper = mes.at(0).toUpperCase() + mes.substring(1);

        //dia
        draw_day.y += base_y

        page.drawText(dia, {
            ...draw_day,
            font,
            color: rgb(r, g, b)
        });


        //mes
        draw_month.y += base_y
        page.drawText(mesUpper, {
            ...draw_month,
            font,
            color: rgb(r, g, b)
        });

        //ano
        draw_year.y += base_y 
        page.drawText(ano, {
            ...draw_year,
            font,
            color: rgb(r, g, b)
        });



        //referente a doação
        draw_reffering_to.y += base_y
        let refferingTo = "Doação";
        page.drawText(refferingTo, {
            ...draw_reffering_to,
            font,
            color: rgb(r, g, b)
        });

        //workwer
        draw_worker.y += base_y
        page.drawText(donation.worker?.name || "", {
            ...draw_worker,
            font,
            color: rgb(r, g, b)
        });


        if (donation.is_donation_canceled) {

            const {y: dcd_y, x: dcd_x, rotate, size} = draw_canceled_donation

            page.drawText("CANCELADO", {
                y: page.getHeight() - dcd_y,
                x: page.getWidth() - (page.getWidth() - dcd_x),
                rotate: degrees(rotate),
                color: rgb(0, 0, 0),
                size,
            });
        }


        
        //linha horizontal ______
        const { start, end, color: dhl_color, line_cap, thickness} = draw_horizontal_line

        start.y += base_y
        end.y += base_y

        const {r: dhl_r, g: dhl_g, b: dhl_b} = dhl_color

        page.drawLine({
            start,
            end,
            color: rgb(dhl_r, dhl_g, dhl_b),
            lineCap: line_cap,
            thickness
        });

      
        //linha vertical |
        // page.drawLine({
        //     start: { x: 826, y: y },
        //     end: { x: 826, y: 365 + y },
        //     color: rgb(0.5, 0.5, 0.5),
        //     lineCap: 1,
        //     thickness: 0.1
        // });
        // //linha vertical |
        // page.drawLine({
        //     start: {x:26 ,y: 0},
        //     end: {x:26, y: 365},
        //     color: rgb(0.5, 0.5, 0.5),
        //     lineCap: 1,
        //     thickness: 0.1
        // })
        // page.scale(0.75, 0.75);


        //cria um array de bytes
        const pdfBytes = await doc.save();  

        //salva
        if (saveFile) {

            //chama o storage provider pra salvar
            try {
                const storageProvider = container.resolve(LocalStorageProvider);
                
                // let dir2 = path.join("C:","Users","Giovanny","Desktop","recibos", `${donation.ngo.name}`, `${ano}`, `${mes}`)
                let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`;
                let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`;
                
                
                storageProvider.saveAsync(dir, file_name, pdfBytes);
                
            } catch (error) {
                console.error(error)
                throw new AppError("Não foi posivel salvar o arquivo", 500)
            }
        }

        return pdfBytes
    }

    @getExecutionTime()
    async createBooklet({
        donations, 
        doc, 
        saveFile, 
        template_name,
        template_config 
    }: ICreateReceiptBooklet): Promise<ICreateBooletResponse> {


        const {draw_vertical_line, receipts_per_page} = template_config.generate_booklet
        
        

        let pageIndex = 0;//da pagina do booklet
        let index = 1; //da posição do recibo na pagina do booklet


        

        try { //gera os recibos(individualmente)
           
            let files_promises = await Promise.all(donations.map(async (donation) => {
                //para pegar o arquivo
                // let {dia, mes, ano} = getFormatedDateForReceipt(donation.created_at)
                // let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
                // let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`
                // fazer error handling para arquivos que nao existirem
                
    
                // try {
                //     receitpPdf = await fs.promises.readFile(resolve(dir, file_name))
                // } catch (error) {
                //     if(error || !receitpPdf){
    
                //chama o provider
                const fileProvider = container.resolve(PDF_LIBFileProvider);
    
                //gera os recibos(individualmente)
                let receitpPdf = await fileProvider.generateFile({
                    donation, 
                    saveFile: false, 
                    generateForBooklet: true,
                    template_name,
                    template_config
    
                })
    
               
                return receitpPdf
            }))


        //monta as paginas, com os recibos

            let {start, end, line_cap, thickness} = draw_vertical_line
            let {r: dvl_r, g: dvl_g, b: dvl_b} = draw_vertical_line.color

            
            let pages_promises = await Promise.all(files_promises.map(async (file) => {
    
                const [receipt] = await doc.embedPdf(file, [0]);
    
                if (index === 1) {
    
                    doc.addPage();
    
                }
    
    
    
                //pega a pagina atual
                let page = doc.getPage(pageIndex);
    
                
                
                //poe o recibo na page, baseado na:  altura da pagina - sua altura * index(posição do recibo na pagina: 1, 2 ou 3)
                const base_y = page.getHeight() - receipt.height * index; //posição y
    
    
                
                //coloca a img no pdf
                page.drawPage(receipt, {
                    y: base_y,
                    x: 0,
                    //width: page.getWidth()
                    //tira o 50 daqui e poe 75 no generateRecipeForBooklet drawImage
                    //que fica similar, 
                });
    
                // if(donation.is_donation_canceled){
                //     page.drawText("CANCELADO", {
                //         y: y + receipt.height / 3,
                //         x: receipt.width - (receipt.width - 60),
                //         color: rgb(0.95, 0.1, 0.1),
                //         size: 74,
                //     })
                // }
                //linha horizontal ______
                // page.drawLine({
                //     start: { x: 0, y: y + 0.5 },
                //     end: { x: page.getWidth(), y: y + 0.5 },
                //     color: rgb(0.5, 0.5, 0.5),
                //     lineCap: 1,
                //     thickness: 0.1,
                // });
                //linha vertical |

                

                page.drawLine({
                    start: { x: start.x , y: base_y },
                    end: { x: end.x , y: base_y + receipt.height },
                    color: rgb(dvl_r, dvl_g, dvl_b),
                    lineCap: line_cap,
                    thickness,
                });
    
    
    
    
                //se chegar até "receipts_per_page" acabou a pagina 
                if (index === receipts_per_page) {
                    index = 0;  //zera o index
                    pageIndex++; //passa para a proxima pagina
                }
    
                index++; 
    
                //? pra retornar so a ultima vez que densenhar a page
                //if(pageIndex > lastPageIndex) return page
                return page;
    
    
            }));

            
            
            //poe todas as paginas no arquivo
            doc.embedPages(pages_promises);
            
        } catch (error) {
            console.error(error)
            throw new AppError(error.message || "Erro ao gerar o talão", error.statusCode || 500)
        }

        //salva(cria um buffer)
        const pdfBytes = await doc.save(); //cria um array de bytes 

        //nome
        let file_name = `${donations[0].donation_number}__${donations[donations.length - 1].donation_number}.pdf`;

        
        //salva
        if (saveFile) {

            //formara a data 
            const dateProvider = container.resolve(DayjsDateProvider);

            const [month, year] = dateProvider.formatDate(dateProvider.dateNow(), "MM/YYYY").toString().split("/");
            
            //dir para salvar
            let dir = `./tmp/booklet/${year}/${month}/${donations[0].ngo.name}`;

            const storageProvider = container.resolve(LocalStorageProvider);

            await storageProvider.saveSync(dir, file_name, pdfBytes);

            //storageProvider.saveAndCompressFile(dir, file_name, pdfBytes)
        }




        return {
            // file_buffer: pdfBuffer,
            file: pdfBytes,
            file_name
        };


    }

}


export {ReceiptProvider}