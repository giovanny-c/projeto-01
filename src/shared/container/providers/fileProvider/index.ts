import { container } from "tsyringe";
import { IFileProvider } from "./IFileProvider";
import { PDF_KITFileProvider } from "./implementations/PDF_KITFileProvider";
import { PDF_LIBFileProvider } from "./implementations/PDF_LIBFileProvider";

// ou registerInstance?
container.registerSingleton<IFileProvider>(
    "FileProvider",
    PDF_LIBFileProvider
)
