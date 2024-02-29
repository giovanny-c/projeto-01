import * as xlsx from "xlsx";
import { IXlsxParserProvider, xlsxToObjectOptions } from "../IXlsxParserProvider";


class XlsxParserProvider implements IXlsxParserProvider {

    xlsxToObject<TObject>(file: Express.Multer.File, options: xlsxToObjectOptions): TObject[] {
        

        const {parsingOptions, xlsxToObjectOptions} = options


        //file.path
        const excelData = xlsx.readFile(file.path, parsingOptions) //diskstorage

        //pega o nome da primeira planilha
        let sheet = Object.keys(excelData.Sheets)[0]

        //poe o conteudo da 1ª planilha em donations    
        //defval null necessario
        return xlsx.utils.sheet_to_json(excelData.Sheets[sheet], xlsxToObjectOptions) as TObject[]
    
        //e se usar xlsx.stream.to_json??? 
          
  
    }
    
    objectToXlsx<TObject>(data: TObject[], options: xlsx.JSON2SheetOpts, sheetName: string, for_balance: boolean /*, sum_value: boolean*/): Buffer {
         
        const workSheet = xlsx.utils.json_to_sheet(data, options)

            const workBook = xlsx.utils.book_new()


            if(for_balance){
                //transformar isso em uma func

                // pegar a coluna que for a do valor dinamicamente
                const col = xlsx.utils.decode_col("C") // col c = index 2
                    
                const format = 'R$ 0.00' // formato do numero

                const range =  xlsx.utils.decode_range(workSheet["!ref"]) // pega o range(ex: A1, A2, B1, B2) e transforma para index de 0

                

                //para procurar pela coluna certa, pula o primeiro row pois é o header
                for (let i = range.s.r + 1; i <= range.e.r; ++i) {
                
                    //transforma de index de volta para A1
                    const ref = xlsx.utils.encode_cell({r: i, c: col})

                    //transforma a celula para tipo numero
                    workSheet[ref].t = "n"
                    
                    //se a celula conter algo e for do tipo numero 
                    if (workSheet[ref] && workSheet[ref].t === 'n') {
                        
                        //formata ela
                        workSheet[ref].z = format
                    
                    }
                }

                //formula de soma
                const sumFormula = 
                'SUM(' + xlsx.utils.encode_range({s: {c: col, r: range.s.r + 1}, e: {c: col, r: range.e.r}}) + ')';
                
                
                xlsx.utils.sheet_add_aoa(workSheet, [], {origin: -1})//adcionando + 1 linha

                const sumCol = xlsx.utils.encode_cell({ c: col, r: range.e.r + 1})//pegando a primeira celula em baixo so valor

                workSheet[sumCol] = {f: sumFormula};// atribuindo a formula na celula

                

                // const lastColumnRow = xlsx.utils.encode_cell({r: range.e.r + 2, c: col})

                // workSheet["C5"] = {t: 'n', f: 'SUM(C2:C4)' }
                ///////
            }
            
            
            xlsx.utils.book_append_sheet(workBook, workSheet, sheetName)

            return xlsx.writeXLSX(
                workBook
                , {
                    type: "buffer",
                    bookType: "xlsx",
                    
            }) as Buffer

                
    }

}

export { XlsxParserProvider }