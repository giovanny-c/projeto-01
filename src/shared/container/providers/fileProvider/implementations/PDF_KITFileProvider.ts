
// import pdfkit from "pdfkit"

// import fs from "fs"


// import { IFileProvider } from "../IFileProvider"



// class PDF_KITFileProvider implements IFileProvider {


//     generateFile( /*dataCallback, endCallback*/) {

//         const pdfdocument = new pdfkit

//         //para salvar no projeto
//         //pdfdocument.pipe(fs.createWriteStream("output.pdf"))

//         //para fazer ele ser lido mas nao salvo
//         //pdfdocument.on("data", dataCallback)
//         //pdfdocument.on("end", endCallback)


//         pdfdocument.image(templatePath, {
//             align: "center",
//             valign: "center"
//         })

//         pdfdocument.text("nome sobrenome")
//             .fontSize(25)

//         //adiciona outra pagina
//         // pdfdocument.addPage()
//         //     .text("nome sobrenome 2")

//         pdfdocument.end()



//     }

//     async createBooklet(){

//     }



// }

// export { PDF_KITFileProvider }