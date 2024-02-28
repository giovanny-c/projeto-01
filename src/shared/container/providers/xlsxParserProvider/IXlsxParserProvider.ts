import * as xlsx from "xlsx"

interface  xlsxToObjectOptions {

    parsingOptions: xlsx.ParsingOptions
    xlsxToObjectOptions: xlsx.Sheet2JSONOpts
}


interface IXlsxParserProvider {

    xlsxToObject<TObject>(file: Express.Multer.File, options: xlsxToObjectOptions ): TObject[] 

    objectToXlsx<TObject>( data: TObject[], options: xlsx.JSON2SheetOpts, sheetName: string, for_balance?: boolean/*, sum_value: boolean*/): Buffer
    

}
export {IXlsxParserProvider, xlsxToObjectOptions}