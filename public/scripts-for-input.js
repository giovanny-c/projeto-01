function formatToBRLInput(input) {


    let value = input.value 

    value = value.replace(/[^\d,.]/g, '')
    
    if(value.charAt(value.length - 3) === ","){
        
        value = value.replace(/\./g, '-')
        value = value.replace(/\,/g, '.')
        value = value.replace(/\-/g, '')

    }

    input.value = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'

    }).format(value)

    
}

var donationValue = document.querySelector('input[name="donation_value"]')

formatToBRLInput(donationValue)

