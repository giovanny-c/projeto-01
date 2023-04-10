

function verifyEmptyInput(form, event) {

    // const { donor_name, donation_value, worker_id } = form.elements

    // console.log(form.elements)



    for (element of form.elements) {


        removeFormError(element)


        if (!element.value && element.tagName !== "BUTTON") {



            element.style.border = "1px solid red"

            let itemTag = element.parentNode.parentNode
            itemTag.classList.add("form-error")

            let tagP = document.createElement("p")
            tagP.innerHTML = "* insira um valor"
            if (element.tagName === "SELECT") {
                tagP.innerHTML = "* escolha um valor"
            }

            itemTag.appendChild(tagP)


            event.preventDefault()
        }

    }


}

function removeFormError(input) {

    let itemTag = input.parentNode.parentNode

    if (itemTag.classList.contains("form-error")) {

        itemTag.classList.remove("form-error")

        input.style.border = "none"


        itemTag.removeChild(itemTag.lastChild)
    }



}