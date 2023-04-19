

function verifyEmptyInput(form, event) {

    // const { donor_name, donation_value, worker_id } = form.elements

    // console.log(form.elements)



    for (element of form.elements) {


        removeFormError(element)


        if (!element.value && (element.tagName !== "BUTTON" && element.className !== "email-field")) {



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

    let emailFields = form.getElementsByClassName("email-field")


    if (!emailFields[0].value && !emailFields[1].value) {

        emailFields[0].style.border = "1px solid red"

        itemTag = emailFields[0].parentNode.parentNode
        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")
        tagP.innerHTML = "* insira um pelo menos um email"

        itemTag.appendChild(tagP)

        event.preventDefault()

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



function verifyCreateUserFields(form, event) {
    for (element of form.elements) {


        removeFormError(element)


        if (!element.value && (element.tagName !== "BUTTON" && element.className !== "email-field") && element.tagName !== "SELECT") {

            element.style.border = "1px solid red"

            let itemTag = element.parentNode.parentNode

            itemTag.classList.add("form-error")

            let tagP = document.createElement("p")
            tagP.innerHTML = "* insira um valor"


            itemTag.appendChild(tagP)


            event.preventDefault()
        }

    }

    var passwordField = document.querySelector('input[name="password"]')
    var confirmPasswordField = document.querySelector('input[name="confirm_password"]')




    if (passwordField.value.lenght < 4) {
        passwordField.style.border = "1px solid red"

        let itemTag = passwordField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")
        tagP.innerHTML = "*a sennha deve ter pelo menos 4 caracteres"
        itemTag.appendChild(tagP)


        event.preventDefault()

    }
    if (confirmPasswordField.value.lenght < 4) {
        confirmPasswordField.style.border = "1px solid red"

        let itemTag = confirmPasswordField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")
        tagP.innerHTML = "*a sennha deve ter pelo menos 4 caracteres"
        itemTag.appendChild(tagP)


        event.preventDefault()

    }
    if (passwordField.value !== confirmPasswordField.value) {

    }



}




