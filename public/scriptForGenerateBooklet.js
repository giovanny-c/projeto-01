
// function disable() {
//     var button = document.querySelector("button")
//     button.disabled = true
// }

// disable()


//refazer com a rota nova
async function fetchGenerateBooklet(ngo_id, params, tag) {

    var button = document.querySelector("button")

    button.disabled = true
    button.style.cursor = "default"


    tag.className = "download-wait"
    tag.innerHTML = "Gerando arquivo"
    tag.removeAttribute("href")

    try {

        // if (final_number - initial_number < 0 || (isNaN(initial_number) || isNaN(final_number))) {
        //     tag.className = "messages error close"
        //     tag.innerHTML = "O numero Inicial deve ser menor que o numero final."
        //     tag.fontstyle = "default"
        //     tag.removeAttribute("href")

        //     button.disabled = false
        //     button.style.cursor = "pointer"


        //     return
        // }

        const response = await fetch(`/instituicao/${ngo_id}/gerar-talao`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify(params)
        })

        if (!response.ok) {// tudo que tiver status 4** ou 5**
            const error = await response.text()

            tag.className = "messages error close"
            tag.removeAttribute("href")
            tag.innerHTML = error || "Erro ao gerar arquivo"

            button.disabled = false
            button.style.cursor = "pointer"

            return

        }

        if (response.status === 201) {

            const file_name = response.headers.get("content-disposition").split("=")[1]
            //e pegar os headers para o nome
            const blob = await response.blob()
            const fileUrl = URL.createObjectURL(blob)

            // const file_name = initial_number + "__" + final_number + ".pdf"

            tag.className = "download-file"
            tag.innerHTML = "Baixar"
            tag.setAttribute("href", fileUrl)
            tag.setAttribute("download", file_name)


        }

        button.disabled = false
        button.style.cursor = "pointer"

        return



    } catch (err) {
        //o mesmo que !response.ok

        console.error(err)
        tag.className = "messages error close"
        tag.removeAttribute("href")
        tag.innerHTML = err || "Erro ao gerar o arquivo."

        button.disabled = false
        button.style.cursor = "pointer"
    }



}

function warnBigFiles(event, initial, final) {

    if (final - initial > 100) {

        alert("A operação pode demorar alguns segundos. Não feche ou recarregue a aba.")

        // if (!confirmation) {
        //     event.preventDefault()
        // }

        return
    }

    if (final - initial > 300) {
        alert("A operação pode demorar alguns minutos. Não feche ou recarregue a aba.")

        // if (!confirmation) {
        //     event.preventDefault()
        // }

        return
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


