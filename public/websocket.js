//exibe a msg pro cliente


const socket = io()

socket.on("response", (data) => {
    const body = document.querySelector("body")
    const div = document.createElement("div")
    body.appendChild(div)

    console.log("response!")
    console.log(data)
    if (data.success) {
        div.className = "messages success"
        div.innerHTML = data.message
    }

    if (data.error) {
        div.className = "messages error"
        div.innerHTML = data.message
    }

})