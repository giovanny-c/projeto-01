import { container } from "tsyringe";
import { IXlsxParserProvider } from "./IXlsxParserProvider";
import { XlsxParserProvider } from "./implementations/XlsxParserProvider";


container.registerSingleton<IXlsxParserProvider>(
    "XlsxParserProvider",
    XlsxParserProvider
)
