function formatDateStaticP(pDate) {


    var date = pDate.innerHTML

    date = new Date(date)

    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);

    var formatedDate = `${day}/${month}/${year}`






    pDate.innerHTML = `Criado em: ${formatedDate}`



}


function formatPhoneStatic(pPhone) {


    var formatedPhone = pPhone.innerHTML.replace(/\D/g, '')

    console.log(formatedPhone.length)

    if (formatedPhone.length > 9) {

        formatedPhone = formatedPhone
            .replace(/^(\d)/, '($1')
            .replace(/^(\(\d{2})(\d)/, '$1) $2')
            .replace(/(\d{5})(\d{1,5})/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1')
    }

    if (formatedPhone.length === 9) {
        formatedPhone = formatedPhone
            .replace(/(\d{5})(\d{1,5})/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1')
    }

    if (formatedPhone.length < 9) {

        formatedPhone = formatedPhone
            .replace(/(\d{4})(\d{1,5})/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1')
    }

    console.log("aaa")

    pPhone.innerHTML = `Telefone: ${formatedPhone}`


}


var pdate = document.querySelector("p.date")


formatDateStaticP(pdate)

var pphone = document.querySelector("p.phone")

formatPhoneStatic(pphone)