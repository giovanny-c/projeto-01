function formatToBRLStatic(tds) {

    for (let i = 0; i < tds.length; i++) {

        var value = tds[i].innerHTML
        //.replace(/\D/g, "")


        tds[i].innerHTML = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'

        }).format(value)

    }


}

var tds = document.getElementsByClassName("donation_value")

formatToBRLStatic(tds)

// date(timestamp){

//     const date = new Date(timestamp);

//     const year = date.getFullYear();

//     const month = `0${date.getMonth() + 1}`.slice(-2);
//     //slice(-2) vai pegar os dois ultimos caracteres da string

//     const day = `0${date.getUTCDate()}`.slice(-2);

//     const hour = date.getHours()

//     const minutes = date.getMinutes()
    

//     return { 
//         day,
//         month,
//         year,
//         hour,
//         minutes,
//         iso: `${year}-${month}-${day}`,//tipo ISO
//         birthday: `${day}/${month}`,
//         format: `${day}/${month}/${year}`

//    }

//     /*`${year}-${month}-${day}`*/


// },