
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

        const { initial_number, final_number } = params

        if (final_number - initial_number < 0) {
            tag.className = "messages error"
            tag.innerHTML = "Erro: O numero Inicial deve ser menor que o numero final."
            tag.fontstyle = "default"
            tag.removeAttribute("href")

            button.disabled = false
            button.style.cursor = "pointer"

            return
        }



        const response = await fetch(`/instituicao/${ngo_id}/gerar-talao`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify(params)
        })

        if (!response.ok) {
            const error = await response.text()


            tag.className = "messages error"
            tag.removeAttribute("href")
            tag.innerHTML = error || "Erro ao gerar arquivo"



        }

        if (response.status !== 201) {
            console.log(response)
        }

        if (response.status === 201) {

            const blob = await response.blob()
            const fileUrl = URL.createObjectURL(blob)

            const file_name = initial_number + "__" + final_number + ".pdf"

            tag.className = "download-file"
            tag.innerHTML = "Baixar"
            tag.setAttribute("href", fileUrl)
            tag.setAttribute("download", file_name)


        }



    } catch (err) {
        //o mesmo que response.ok


        console.error(err)
        tag.className = "messages error"
        tag.removeAttribute("href")
        tag.innerHTML = err || "Erro: Erro ao gerar o arquivo."

        button.disabled = false
        button.style.cursor = "pointer"
    }

    button.disabled = false
    button.style.cursor = "pointer"

    return

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


