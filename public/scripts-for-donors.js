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

    var phone = pPhone.innerHTML



    pPhone.innerHTML = `Telefone: ${phone.replace(/\D/g, '')
        .replace(/^(\d)/, '($1')
        .replace(/^(\(\d{2})(\d)/, '$1) $2')
        .replace(/(\d{5})(\d{1,5})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')}
`
}


var pdate = document.querySelector("p.date")


formatDateStaticP(pdate)

var pphone = document.querySelector("p.phone")

formatPhoneStatic(pphone)