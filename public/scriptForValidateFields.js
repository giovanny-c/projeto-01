

function validateCreateDontaion(form) {

    const { donor_name, donation_value, worker_id } = form.elements

    console.log(form.elements)

    form.addEventListener("submit", (event) => {


        if (!donation_value.value
            || typeof +(donation_value.value.replace(/(?!\,+)[\D]/g, "").replace(/\,/, ".")) !== "number"
        ) {

            event.preventDefault()
        }

        if (!donor_name.value
            || donor_name.value === ""
        ) {

            event.preventDefault()
        }


        if (!worker_id.value
            || worker_id.value === ""
        ) {

            event.preventDefault()
        }





    })





}