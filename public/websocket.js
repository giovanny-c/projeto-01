

const socket = io()

socket.on("response", (data) => {
    const body = document.querySelector("body")
    const message = document.createElement("div")


    body.appendChild(message)



    if (data.success) {
        message.className = "messages success"
        message.innerHTML = data.message
    }
    if (!data.success) {

        message.className = "messages error close"
        message.innerHTML = data.message

        if (data.fix) {

            message.className = "messages error"

            const closeBtnDiv = document.createElement("div")
            const closeBtn = document.createElement("p")
            closeBtn.className = "close-btn"
            closeBtn.innerHTML = "X"
            message.appendChild(closeBtnDiv)
            closeBtnDiv.appendChild(closeBtn)

            closeBtnDiv.addEventListener("click", () => {
                message.remove()
            })

        }

    }

})

