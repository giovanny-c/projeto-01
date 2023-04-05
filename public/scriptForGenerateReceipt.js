async function fetchGenerateReceipt(file, params, tag) {


    try {
        const response = await fetch(`/file/generate/${file}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify(params)
        })

        if (!response.ok) {
            const error = await response.text()
            console.log(`Error: ${response.status} - ${error}`)
        }


        const arrayBuffer = await response.arrayBuffer()

        return arrayBuffer

        //Nao ta vindo com o nome no download

    } catch (err) {
        console.error("Erro ao gerar o arquivo", err)
    }



}



const donation_id = document.querySelector("input[name='donation_id']").value


this.fetchGenerateReceipt(
    "receipt",
    {
        donation_id: donation_id
    },

).then((response) => {
    // const blob = await response.blob()

    // const fileUrl = URL.createObjectURL(blob)

    // // tag.setAttribute(", "application/octet-stream")
    // tag.setAttribute("src", fileUrl)
    // tag.style.visibility = "visible"
    const file = response.toString("base64")
    console.log(file)
    var iFrameTag = document.querySelector("iframe")
    iFrameTag.src = `data:application/pdf;base64,${file}`
}).catch((err) => {
    console.error(err)
})


