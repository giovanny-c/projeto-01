

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



//input[name="confirm_password"]
function verifyCreateUserFields(event) {


    var nameField = document.querySelector('input[name="user_name"]')
    var emailField = document.querySelector('input[name="email"]')
    var passwordField = document.querySelector('input[name="password"]')
    var confirmPasswordField = document.querySelector('input[name="confirm_password"]')

    if (nameField.value.match(/([^A-Za-z0-9ãõç\s])/g) || nameField.value.length < 3) {

        removeFormError(nameField)

        nameField.style.border = "1px solid red"

        let itemTag = nameField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")


        if (nameField.value.length < 3) {

            tagP.innerHTML = "*o nome deve ter pelo menos 3 caracteres"

        } else {
            tagP.innerHTML = "*o nome contem caracteres invalidos"

        }

        itemTag.appendChild(tagP)

        event.preventDefault()

    }
    if (passwordField.value.match(/([^A-Za-z0-9ãõç\-.*&$#@!?=+_])/g) || passwordField.value.length < 4) {

        removeFormError(passwordField)

        passwordField.style.border = "1px solid red"

        let itemTag = passwordField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")

        if (passwordField.value.length < 4) {

            tagP.innerHTML = "*a sennha deve ter pelo menos 4 caracteres"
        } else {
            tagP.innerHTML = "*a senha contem caracteres invalidos. caracteres especiais permitidos ãõç-.*&$#@!?=+_"
        }

        itemTag.appendChild(tagP)


        event.preventDefault()

    }
    if (passwordField.value !== confirmPasswordField.value) {

        removeFormError(confirmPasswordField)

        confirmPasswordField.style.border = "1px solid red"

        let itemTag = confirmPasswordField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")
        tagP.innerHTML = "*senha e confirmação não correspondem"
        itemTag.appendChild(tagP)


        event.preventDefault()
    }
    if (!emailField.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {

        removeFormError(emailField)

        emailField.style.border = "1px solid red"

        let itemTag = emailField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")
        tagP.innerHTML = "*email invalido"
        itemTag.appendChild(tagP)


        event.preventDefault()
    }


}

function verifyUpdateUserFields(event) {


    var nameField = document.querySelector('input[name="user_name"]')
    var emailField = document.querySelector('input[name="email"]')

    if (nameField.value.match(/([^A-Za-z0-9ãõç\s])/g) || nameField.value.length < 3) {

        removeFormError(nameField)

        nameField.style.border = "1px solid red"

        let itemTag = nameField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")


        if (nameField.value.length < 3) {

            tagP.innerHTML = "*o nome deve ter pelo menos 3 caracteres"

        } else {
            tagP.innerHTML = "*o nome contem caracteres invalidos"

        }

        itemTag.appendChild(tagP)

        event.preventDefault()

    }
    if (!emailField.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {

        removeFormError(emailField)

        emailField.style.border = "1px solid red"

        let itemTag = emailField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")
        tagP.innerHTML = "*email invalido"
        itemTag.appendChild(tagP)


        event.preventDefault()
    }
}

//campo diferent input[name="password_confirmation"]
function verifyResetPasswordFields(event) {


    var emailField = document.querySelector('input[name="email"]')
    var passwordField = document.querySelector('input[name="password"]')
    var confirmPasswordField = document.querySelector('input[name="password_confirmation"]')

    if (passwordField.value.match(/([^A-Za-z0-9ãõç\-.*&$#@!?=+_])/g) || passwordField.value.length < 4) {

        removeFormError(passwordField)

        passwordField.style.border = "1px solid red"

        let itemTag = passwordField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")

        if (passwordField.value.length < 4) {

            tagP.innerHTML = "*a sennha deve ter pelo menos 4 caracteres"
        } else {
            tagP.innerHTML = "*a senha contem caracteres invalidos. caracteres especiais permitidos ãõç-.*&$#@!?=+_"
        }

        itemTag.appendChild(tagP)


        event.preventDefault()

    }
    if (passwordField.value !== confirmPasswordField.value) {

        removeFormError(confirmPasswordField)

        confirmPasswordField.style.border = "1px solid red"

        let itemTag = confirmPasswordField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")
        tagP.innerHTML = "*senha e confirmação não correspondem"
        itemTag.appendChild(tagP)


        event.preventDefault()
    }
    if (!emailField.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {

        removeFormError(emailField)

        emailField.style.border = "1px solid red"

        let itemTag = emailField.parentNode.parentNode

        itemTag.classList.add("form-error")

        let tagP = document.createElement("p")
        tagP.innerHTML = "*email invalido"
        itemTag.appendChild(tagP)


        event.preventDefault()
    }


}




