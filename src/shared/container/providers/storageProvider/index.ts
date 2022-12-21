import { container } from "tsyringe";
import "dotenv/config"
import { LocalStorageProvider } from "./implementations/LocalStorageProvider";
import { IStorageProvider } from "./IStorageProvider";
import { S3StorageProvider } from "./implementations/S3StorageProvider";

const storage = {
    local: LocalStorageProvider,
    s3: S3StorageProvider
}

container.registerSingleton<IStorageProvider>(
    "StorageProvider",
    storage[process.env.STORAGE as string]
)