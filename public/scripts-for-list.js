function formatToBRLStaticLoop(tds) {

    for (let i = 0; i < tds.length; i++) {

        var value = tds[i].innerHTML
        //.replace(/\D/g, "")


        tds[i].innerHTML = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'

        }).format(value)

    }


}
function formatToBRLStatic(tag) {


    var value = tag.innerHTML

    tag.innerHTML = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'

    }).format(value)




}


function formatDateStaticLoop(tds) {

    for (let i = 0; i < tds.length; i++) {

        const date = new Date(tds[i].innerHTML);

        const year = date.getFullYear();

        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        //slice(-2) vai pegar os dois ultimos caracteres da string

        const day = `0${date.getUTCDate()}`.slice(-2);

        // const hour = date.getHours()

        // const minutes = date.getMinutes()

        tds[i].innerHTML = `${day}/${month}/${year}`
    }
    /*`${year}-${month}-${day}`*/


}

function formatDateStaticP(pDates) {

    var dates = pDates.innerHTML.match(/\d+-\d+-\d+/g)


    for (let i = 0; i < dates.length; i++) {
        var date = new Date(dates[i]);

        const year = date.getFullYear();
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);

        const day = `0${date.getUTCDate()}`.slice(-2);

        var formatedDate = `${day}/${month}/${year}`



        var text = pDates.innerHTML
        //pega so a primeira ocorrencia de yyyy-mm-dd
        var newText = text.replace(/(\d+-\d+-\d+){1}/, formatedDate)

        pDates.innerHTML = newText
    }


}


function formatPhoneStaticLoop(tds) {

    for (phone in tds) {
        if (phone.replace(/\D/g, '').length > 10) {
            return phone.replace(/\D/g, '')
                .replace(/^(\d)/, '($1')
                .replace(/^(\(\d{2})(\d)/, '$1) $2')
                .replace(/(\d{5})(\d{1,5})/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }
        if (phone.replace(/\D/g, '').length > 9) {
            return phone.replace(/\D/g, '')
                .replace(/^(\d)/, '($1')
                .replace(/^(\(\d{2})(\d)/, '$1) $2')
                .replace(/(\d{4})(\d{1,5})/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }

        if (phone.replace(/\D/g, '').length === 9) {
            return phone.replace(/\D/g, '')
                .replace(/(\d{5})(\d{1,5})/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }


        if (phone.replace(/\D/g, '').length < 9) {
            return phone.replace(/\D/g, '')
                .replace(/(\d{4})(\d{1,5})/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }



    }
    /*`${year}-${month}-${day}`*/


}


var tdsValue = document.getElementsByClassName("donation_value")
var totalValue = document.querySelector("p.total")
var tdsDate = document.getElementsByClassName("created_at")
var totalDates = document.querySelector("p.total-date")
var tdsPhones = document.getElementsByClassName("lPhone")

if (totalValue) {
    formatToBRLStatic(totalValue)
}
if (tdsValue) {
    formatToBRLStaticLoop(tdsValue)
}
if (tdsDate) {
    formatDateStaticLoop(tdsDate)
}
if (totalDates) {
    formatDateStaticP(totalDates)
}
if (tdsPhones) {
    formatPhoneStaticLoop(tdsPhones)
}


//deixar a formatação para o front