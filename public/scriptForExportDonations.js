


async function fetchExportDonations(ngo_id, params, tag) {

    console.log("vai")

    var button = document.querySelector("button")

    button.disabled = true
    button.style.cursor = "default"


    tag.className = "download-wait"
    tag.innerHTML = "Gerando arquivo"
    tag.removeAttribute("href")

    try {

        // if (final_number - initial_number < 0 || (isNaN(initial_number) || isNaN(final_number))) {
        //     tag.className = "messages error"
        //     tag.innerHTML = "O numero Inicial deve ser menor que o numero final."
        //     tag.fontstyle = "default"
        //     tag.removeAttribute("href")

        //     button.disabled = false
        //     button.style.cursor = "pointer"


        //     return
        // }

        const response = await fetch(`/instituicao/${ngo_id}/doacao/exportar`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify(params)
        })

        if (!response.ok) {// tudo que tiver status 4** ou 5**
            const error = await response.text()

            tag.className = "messages error"
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
        tag.className = "messages error"
        tag.removeAttribute("href")
        tag.innerHTML = err || "Erro ao gerar o arquivo."

        button.disabled = false
        button.style.cursor = "pointer"
    }



}

function warnBigFiles(initial, final) {

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

