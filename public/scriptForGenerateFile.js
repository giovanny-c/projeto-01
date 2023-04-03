async function fetchGenerateFile(file, params, tag) {


    try {
        const response = await fetch(`/file/generate/${file}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify(params)
        })

        if (!response.ok) {
            console.log(`Error: ${response.status}`)
        }


        const blob = await response.blob()
        const fileUrl = URL.createObjectURL(blob)

        const [ini, fin] = params.interval.slice(0, 2)

        const file_name = ini + "__" + fin + ".pdf"

        tag.setAttribute("href", fileUrl)
        tag.setAttribute("download", file_name)
        tag.style.visibility = "visible"

    } catch (err) {
        console.error("Erro ao gerar", err)
    }



}

//pegar do template dps


// const aTag = document.querySelector(".download-file")
// // const interval = document.querySelector("input[name='donation_number_interval']").value
// const ngo_id = document.querySelector("input[name='ngo_id']").value


// fetchGenerateFile(
//     "booklet",
//     {
//         donation_number_interval: [1000, 1050],
//         ngo_id: ngo_id
//     },
//     aTag

// )


