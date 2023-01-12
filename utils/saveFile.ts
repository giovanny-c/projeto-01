import fs from "fs"

function saveFileUtil(dir: string, file_name:string, file: Uint8Array ): void{
       

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFile(`${dir}/${file_name}`, file,
        (err) => {
            if (err) throw err
    })  



}

export {saveFileUtil}