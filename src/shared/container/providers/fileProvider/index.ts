import { container } from "tsyringe";
import { IFileProvider } from "./IFileProvider";
import { FileProvider } from "./implementations/FileProvider";

// ou registerInstance?
container.registerSingleton<IFileProvider>(
    "FileProvider",
    FileProvider
)
