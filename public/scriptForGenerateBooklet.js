async function fetchGenerateBooklet(file, params, tag) {



    tag.style.visibility = "visible"
    tag.innerHTML = "Gerando arquivo"
    tag.removeAttribute("href")
    tag.style.backgroundColor = "rgba(0, 0, 0, 0)"



    try {

        const [ini, fin] = params.interval.slice(0, 2)

        if (fin - ini < 0) {
            tag.innerHTML = "O numero Inicial deve ser menor que o numero final."
            tag.style.backgroundColor = "rgba(0, 0, 0, 0)"
            tag.style.visibility = "visible"
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


            tag.removeAttribute("href")
            tag.style.backgroundColor = "rgba(0, 0, 0, 0)"
            tag.style.visibility = "visible"
            tag.innerHTML = error || "Erro ao gerar arquivo"

        }

        if (response.status === 201) {

            const blob = await response.blob()
            const fileUrl = URL.createObjectURL(blob)

            const file_name = ini + "__" + fin + ".pdf"

            tag.setAttribute("href", fileUrl)
            tag.setAttribute("download", file_name)
            tag.style.backgroundColor = "rgb(45, 69, 92)"
            tag.style.visibility = "visible"

            return

        }


    } catch (err) {
        //o mesmo que response.ok
        console.error(err)
        tag.innerHTML = err || "Erro ao gerar o arquivo."
        tag.style.visibility = "visible"
        tag.removeAttribute("href")
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


