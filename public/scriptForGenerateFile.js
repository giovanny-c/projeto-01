async function fetchGenerateFile(file, params) {


    try {
        const response = await fetch(`/file/generate/${file}`, {
            method: "POST",
            mode: "same-origin",
            body: params
        })

        if (!response.ok) {
            console.log(`Error: ${response.status}`)
        }


        return await response.arrayBuffer()

        //new Uint8Array(file)

    } catch (err) {
        console.error("Erro ao pesquisar", err)
    }
}

//pegar do template dps


fetchGenerateFile(
    "booklet",
    JSON.stringify(donation_number_interval = [1000, 1010])
).then((file) => {

    console.log(file)
    const aTag = document.querySelector(".download-file")
    aTag.setAttribute("href", `data:application/pdf;base64,${file}`)

}).catch((err) => {
    console.error(err)
})

