async function fetchGenerateBooklet(file, params, tag) {




    tag.className = "download-wait"
    tag.innerHTML = "Gerando arquivo"
    tag.removeAttribute("href")



    try {

        const [ini, fin] = params.interval.slice(0, 2)

        if (fin - ini < 0) {
            tag.className = "download-error"
            tag.innerHTML = "O numero Inicial deve ser menor que o numero final."
            tag.removeAttribute("href")
            return
        }


        const response = await fetch(`/file/generate/${file}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify(params)
        })

        if (!response.ok) {
            const error = await response.text()


            tag.className = "download-error"
            tag.removeAttribute("href")
            tag.innerHTML = error || "Erro ao gerar arquivo"

        }

        if (response.status === 201) {

            const blob = await response.blob()
            const fileUrl = URL.createObjectURL(blob)

            const file_name = ini + "__" + fin + ".pdf"

            tag.className = "download-file"
            tag.innerHTML = "Baixar"
            tag.setAttribute("href", fileUrl)
            tag.setAttribute("download", file_name)

            return

        }


    } catch (err) {
        //o mesmo que response.ok
        console.error(err)
        tag.className = "download-error"
        tag.removeAttribute("href")
        tag.innerHTML = err || "Erro ao gerar o arquivo."
    }



}

function warnBigFiles(event, initial, final) {

    if (final - initial > 100) {

        alert("A operação pode demorar alguns segundos")

        // if (!confirmation) {
        //     event.preventDefault()
        // }

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


