

const socket = io()

socket.on("response", (data) => {
    const body = document.querySelector("body")
    const div = document.createElement("div")
    body.appendChild(div)


    if (data.success) {
        div.className = "messages success"
        div.innerHTML = data.message
    }

    if (!data.success) {
        div.className = "messages error"
        div.innerHTML = data.message
    }

})

