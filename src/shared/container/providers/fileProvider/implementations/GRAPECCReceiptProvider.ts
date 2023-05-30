import { PDFDocument, PDFFont, PDFImage, degrees, rgb } from "pdf-lib";
import { Donation } from "../../../../../modules/donations/entities/donation";
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


@singleton()
class GRAPECCReceiptProvider implements INGOReceiptProvider {

    async generateReceipt({doc, donation, saveFile, template, templateSign, font, generateForBooklet}: IGenerateReceipt): Promise<Uint8Array> {

       
        
        const storageProvider = container.resolve(LocalStorageProvider);


        const page = doc.addPage();

        //default: x 595 | y 841
        
        //se for gerar recibo 
        // numero base para calcular a posição
        let y = 568.14

        //se for pra gerar para talao
        //a pagina vai ter 841 por 273
        if(generateForBooklet){

            page.setSize(page.getWidth(), 273.75);

            y = 0
        }

        const pageWidth = page.getWidth()
        
        page.drawImage(template, {
            y: 0 + y,
            x: 30,
            width: pageWidth - 55,
            height: 273.75,
            
        });

        page.drawImage(templateSign, {
            y: 21 + y,
            x: 314.25,
            width: 56.25,
            height: 36
        });

        
        //numero da doaçao
        page.drawText(donation.donation_number.toString(), {
            y: 171.75 + y,
            x: 135,

            // rotate: degrees(90),
            color: rgb(0.95, 0.1, 0.1),
            size: 17.25 //*0.75?
        });


        let [, valor] = formatToBRL(donation.donation_value as number).toString().split("$");

        //valor numerico
        page.drawText(valor, {
            y: 172.5 + y,
            x: 391.50,
            // rotate: degrees(90),
            size: 22.50,
            font,
            color: rgb(0.143, 0.133, 0.610) //rgb(0.122, 0.160, 0.797)
        });

        //se terminar em a e i o u nao seguido de n m r s z o e?
        let nomeArray: string[] = donation.donor_name.match(/.{1,50}\b/g);
        if (font) {
            nomeArray = donation.donor_name.match(/.{1,50}\b/g);
        }
        //nome
        page.drawText(nomeArray[0], {
            y: 155.25 + y,
            x: 144.75,
            // rotate: degrees(90),
            size: 17.25,
            // maxWidth: 560,
            // wordBreaks: [" ", "-"],
            // lineHeight: 21,
            font,
            color: rgb(0.143, 0.133, 0.610)
        });

        if (nomeArray[1] && nomeArray[1].length) {

            page.drawText(nomeArray[1], {
                y: 139.50 + y,
                x: 56.25,
                // rotate: degrees(90),
                size: 17.25,
                font,
                color: rgb(0.143, 0.133, 0.610)
            });
        }

        //valor por extenso
        let valorPorExtenso = extenso(valor, { mode: "currency", currency: { type: "BRL" }, locale: "br" });

        let vpeArray: string[] = valorPorExtenso.match(/.{1,58}\b/g);

        //para separar com hifen (nao funcionou 100%)
        // if(!vpeArray[0].match(/[ ,]$|( e)$/) ) {
        //     vpeArray[0] = `${vpeArray[0]}-`
        //    console.log(vpeArray)
        //primeira letra maiuscula
        vpeArray[0] = vpeArray[0].at(0).toUpperCase() + vpeArray[0].substring(1);

        page.drawText(vpeArray[0], {
            y: 120.75 + y,
            x: 135,
            // rotate: degrees(90),
            size: 17.25,
            font,
            color: rgb(0.143, 0.133, 0.610)
        });

        if (vpeArray[1] && vpeArray[1].length) {

            page.drawText(vpeArray[1], {
                y: 104.25 + y,
                x: 56.25,
                // rotate: degrees(90),
                size: 17.25,
                font,
                color: rgb(0.143, 0.133, 0.610)
            });
        }


        //data do recibo 
        const { dia, mes, ano } = getFormatedDateForReceipt(donation.created_at);


        let mesUpper = mes.at(0).toUpperCase() + mes.substring(1);

        page.drawText(dia, {
            y: 52.50 + y,
            x: 307.50,
            // rotate: degrees(90),
            size: 18.75,
            font,
            color: rgb(0.143, 0.133, 0.610)
        });

        page.drawText(mesUpper, {
            y: 52.50 + y,
            x: 365.25,
            // rotate: degrees(90),
            size: 18.75,
            font,
            color: rgb(0.143, 0.133, 0.610)
        });
        page.drawText(ano, {
            y: 52.50 + y,
            x: 501,
            // rotate: degrees(90),
            size: 18.75,
            font,
            color: rgb(0.143, 0.133, 0.610)
        });



        let refferingTo = "Doação";
        page.drawText(refferingTo, {
            y: 88.50 + y,
            x: 127.50,
            size: 16.50,
            font,
            color: rgb(0.143, 0.133, 0.610)
        });

        //workwer
        page.drawText(donation.worker?.name || "", {
            y: 12 + y,
            x: 60,
            size: 15,
            font,
            color: rgb(0.143, 0.133, 0.610)
        });

        if (donation.is_donation_canceled) {

            page.drawText("CANCELADO", {
                y: page.getHeight() - 144,
                x: page.getWidth() - (page.getWidth() - 120),
                rotate: degrees(-12),
                color: rgb(0, 0, 0),
                size: 63.75,
            });
        }


        //linha horizontal ______
        page.drawLine({
            start: { x: 0, y: y + 0.5 },
            end: { x: 600, y: y + + 0.5},
            color: rgb(0.5, 0.5, 0.5),
            lineCap: 1,
            thickness: 0.1,
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





        const pdfBytes = await doc.save(); //cria um array de bytes 







        //criar o pdf no dir
        //se mudar a estensao muda o arquivo?
        //const dir = resolve(__dirname, "..", "tmp", "receipts", "")
        if (saveFile) {

            // let dir2 = path.join("C:","Users","Giovanny","Desktop","recibos", `${donation.ngo.name}`, `${ano}`, `${mes}`)
            let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`;
            let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`;


            storageProvider.saveAsync(dir, file_name, pdfBytes);
        }

        return pdfBytes
    }

    @getExecutionTime()
    async createBooklet({donations, doc, saveFile }: ICreateReceiptBooklet): Promise<ICreateBooletResponse> {

        const storageProvider = container.resolve(LocalStorageProvider);
        const dateProvider = container.resolve(DayjsDateProvider);

        const [month, year] = dateProvider.formatDate(dateProvider.dateNow(), "MM/YYYY").toString().split("/");


        let pageIndex = 0;//da pagina do booklet
        let index = 1; //da posição do recibo na pagina do booklet


        const files_promises = await Promise.all(donations.map(async (donation) => {
            //para pegar o arquivo
            // let {dia, mes, ano} = getFormatedDateForReceipt(donation.created_at)
            // let dir = `./tmp/receipts/${donation.ngo.name}/${ano}/${mes}`
            // let file_name = `${donation.donor_name}_${dia}_${donation.donation_number}_${donation.id}.pdf`
            // fazer error handling para arquivos que nao existirem
            let receitpPdf: Buffer | Uint8Array;

            // try {
            //     receitpPdf = await fs.promises.readFile(resolve(dir, file_name))
            // } catch (error) {
            //     if(error || !receitpPdf){
            const fileProvider = container.resolve(PDF_LIBFileProvider);

            //se nao salvase o arquivo iria mais rapido?
            //provavel q sim
            receitpPdf = await fileProvider.generateFile({
                donation, 
                saveFile: false, 
                generateForBooklet: true
            });



            //     }
            // }
            return receitpPdf;
        }));

        const pages_promises = await Promise.all(files_promises.map(async (file) => {

            const [receipt] = await doc.embedPdf(file, [0]);

            if (index === 1) {

                doc.addPage();

            }



            //pega a pagina atual
            let page = doc.getPage(pageIndex);


            //page.setSize(receipt.width, receipt.height * 3)
            const y = page.getHeight() - receipt.height * index; //posição y



            //coloca a img no pdf
            page.drawPage(receipt, {
                y,
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
                start: { x: 28, y: y },
                end: { x: 28, y: y + receipt.height },
                color: rgb(0.5, 0.5, 0.5),
                lineCap: 1,
                thickness: 0.1
            });




            //se chegar a 3 acabou a pagina 
            if (index === 3) {
                index = index - 3;
                pageIndex++;


            }


            index++;

            //? pra retornar so a ultima vez que densenhar a page
            //if(pageIndex > lastPageIndex) return page
            return page;


        }));



        doc.embedPages(pages_promises);



        const pdfBytes = await doc.save(); //cria um array de bytes 





        // const pdfBuffer = await doc.saveAsBase64()
        //salva
        let dir = `./tmp/booklet/${year}/${month}/${donations[0].ngo.name}`;

        let file_name = `${donations[0].donation_number}__${donations[donations.length - 1].donation_number}.pdf`;

        //tipo isso
        // if(compression){
        //     file_name += ".gz"
        // }
        if (saveFile) {

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


export {GRAPECCReceiptProvider}