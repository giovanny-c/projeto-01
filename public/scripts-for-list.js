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
function formatDateStatic(tds) {

    for (let i = 0; i < tds.length; i++) {

        const date = new Date(tds[i].innerHTML);

        const year = date.getFullYear();

        const month = `0${date.getMonth() + 1}`.slice(-2);
        //slice(-2) vai pegar os dois ultimos caracteres da string

        const day = `0${date.getUTCDate()}`.slice(-2);

        // const hour = date.getHours()

        // const minutes = date.getMinutes()

        tds[i].innerHTML = `${day}/${month}/${year}`
    }
    /*`${year}-${month}-${day}`*/


}
function formatToBRLStatic(tag) {


    var value = tag.innerHTML

    tag.innerHTML = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'

    }).format(value)




}

var tdsValue = document.getElementsByClassName("donation_value")
var tdsDate = document.getElementsByClassName("created_at")
var totalValue = document.querySelector(".total p")

formatToBRLStatic(totalValue)
formatToBRLStaticLoop(tdsValue)
formatDateStatic(tdsDate)



//deixar a formatação para o front