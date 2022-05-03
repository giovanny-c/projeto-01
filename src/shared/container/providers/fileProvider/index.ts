import { container } from "tsyringe";
import { IFileProvider } from "./IFileProvider";
import { FileProvider } from "./implementations/FileProvider";


container.registerSingleton<IFileProvider>(
    "FileProvider",
    FileProvider
)
