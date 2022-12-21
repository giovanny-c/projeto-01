import { AWSError, S3 } from "aws-sdk";

import upload from "@config/upload";

import * as fs from "fs"

import * as mime from "mime"


import { resolve } from "path";

import { IFilePath, IStorageProvider } from "../IStorageProvider";


class S3StorageProvider implements IStorageProvider {

    private client: S3

    constructor() {
        this.client = new S3({
            region: process.env.AWS_BUCKET_REGION
        })
    }

    async save({ file, folder }: IFilePath): Promise<string> {

        try {


            const originalname = resolve(upload.tmpFolder, file) //arquivo salvo(tmp)

            // let file_type = mime.getExtension(originalname) //pega a extensao

            const bucketName = `${process.env.AWS_BUCKET}/${folder}`

            const fileContent = fs.readFileSync(originalname)

            const contentType = mime.getType(originalname) as string

            await this.client.putObject({
                Bucket: bucketName,
                Key: file,
                ACL: "public-read",
                Body: fileContent,
                ContentType: contentType

            }, (err) => {
                if (err) throw err
            }).promise()

            fs.unlinkSync(originalname)

            return file

        } catch (error) {
            throw error
        }
    }
    async delete({ file, folder }: IFilePath): Promise<void> {

        await this.client.deleteObject({
            Bucket: `${process.env.AWS_BUCKET}/${folder}`,
            Key: file,

        }, (err) => {

            if (err) throw err

        }).promise()
    }

}

export { S3StorageProvider }