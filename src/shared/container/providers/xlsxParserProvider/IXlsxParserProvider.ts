import * as xlsx from "xlsx"

interface  xlsxToObjectOptions {

    parsingOptions: xlsx.ParsingOptions
    xlsxToObjectOptions: xlsx.Sheet2JSONOpts
}


interface IXlsxParserProvider {

    xlsxToObject<T>(file: Express.Multer.File, options: xlsxToObjectOptions ): T 

    objectToXlsx<T>( data: T[], options: xlsx.JSON2SheetOpts, sheetName: string): Buffer
    

}
export {IXlsxParserProvider, xlsxToObjectOptions}