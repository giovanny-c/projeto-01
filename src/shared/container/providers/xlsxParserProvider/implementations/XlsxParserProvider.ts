import * as xlsx from "xlsx";
import { IXlsxParserProvider, xlsxToObjectOptions } from "../IXlsxParserProvider";


class XlsxParserProvider implements IXlsxParserProvider {

    xlsxToObject<T>(file: Express.Multer.File, options: xlsxToObjectOptions): T {
        

          const {parsingOptions, xlsxToObjectOptions} = options


          //file.path
          const excelData = xlsx.readFile(file.path, parsingOptions) //diskstorage

          //pega o nome da primeira planilha
          let sheet = Object.keys(excelData.Sheets)[0]
  
          //poe o conteudo da 1ª planilha em donations    
          //defval null necessario
          return xlsx.utils.sheet_to_json(excelData.Sheets[sheet], xlsxToObjectOptions) as T
      
          //e se usar xlsx.stream.to_json??? 
          
  
    }
    
    objectToXlsx<T>(data: T[], options: xlsx.JSON2SheetOpts, sheetName: string): Buffer {
         
        const workSheet = xlsx.utils.json_to_sheet(data, options)

            const workBook = xlsx.utils.book_new()

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