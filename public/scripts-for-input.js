function formatToBRLInput(input) {




    input.value = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'

    }).format(input.value)




}

var donationValue = document.querySelector('input[name="donation_value"]')


if (donationValue) {
    console.log(formatToBRLInput(donationValue))
}