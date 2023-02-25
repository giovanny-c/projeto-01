
function cleanList(input) {
    //on lose focus destroi a lista
}
async function searchDonor(input) {

    //destruir as divs a cada novo iput

    var sendEmailForm = document.querySelector(".send-email-form")

    if (input.value.length > 1) {

        var value = input.value.toLowerCase()

        try {
            const response = await fetch(`/doadores/filtrar?value=${value}`, {
                method: "GET",
                mode: "cors"
            })

            if (!response.ok) {
                console.log(`Error: ${response.status}`)
            }

            const donors = await response.json()

            console.log(donors)

            donors.forEach(donor => {
                console.log(donor)

                var list = document.createElement("div")
                list.className = "list-item"

                var content = document.createElement("div")
                content.className = "content"


                sendEmailForm.appendChild(list)
                list.appendChild(content)

                content.innerHTML = `${donor.name} <${donor.response}>`

            })



        } catch (error) {
            console.error("Erro ao pesquisar", error)
        }

    }

}



const Mask = {

    apply(input, func) {

        setTimeout(function () {//funçao nativa do js
            //ela vai fazer com que apos 1ms
            //execute os comandos abaixo e 
            //o input seja limpo

            input.value = Mask[func](input.value)
            //limpa o campo e usa uma função de mascara
            //que existe dentro do objeto Mask
            //ver src/app/views/products/fields.njk

            //pega o valor do input e usa a mascara que vai
            //ser passada dinamicamente no fields
            //para formatar

        }, 1)//1ms


    },

    formatBRL(value) {//mascara que formata para real

        value = value.replace(/\D/g, "")
        //tira tudo que nao for numero do value
        //e substitui por vazio


        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'

        }).format(value / 100)
        //vai formatar o value para real deixando 
        //com o tipo de moeda
        //divide por 100 pois a virgula da formatação 
        //do real e substituida por vazio
        //  ex R$1,00 vira 100
        //quando formatar pra real de novo viraria R$100,00

    },

    formatPhone(value) {
        // /(\(\d{2}\))*(\d{4,5}-\d{4})/g 
        // meu codigo
        // value = value.replace(/([^\d\(\)])/g, "")


        // let value1, value2

        // if (value.length > 5) {



        //     value1 = value.slice(0, 5)
        //     value2 = value.slice(5)

        //     return `${value1}-${value2}`
        // }

        // return value

        return value.replace(/\D/g, '')
            .replace(/^(\d)/, '($1')
            .replace(/^(\(\d{2})(\d)/, '$1) $2')
            .replace(/(\d{5})(\d{1,5})/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');


    },

    formatEmail(value) {

        return value.replace(/[^\w\d@._\-]/g, "")
    },

    formatDay(value) {


        return value.replace(/(\D)|(\d{3,})|([3-9][2-9])|([4-9][0-9])/g, "")

    },

    formatMonth(value) {

        return value.replace(/(\D)|(\d{3,})|([1-9][3-9])|([2-9][0-9])/g, "")
    },

    formatAdd0(value) {

        if (value === "0" || value === "" || value === "00") {

            return "01"

        }

        if (value < 10) {

            if (value.length > 1) {
                return value
            }

            return value = `0${value}`
        }

        return value
    },
    // formatDay_Month(value) {

    //     value = value.replace(/\D/, "")



    //     if (value.length >= 4) {

    //         console.log(value)
    //         var day = value.slice(0, 2)
    //         var month = value.slice(2, 4)



    //         if (day > 31) {
    //             day = 31
    //         }

    //         if (month > 12) {
    //             month = 12
    //         }

    //         return `${day}/${month}`
    //     }

    //     return value

    // },

    cpfCnpj(value) {

        value = value.replace(/\D/g, "")//só pega numeros

        //ve se é cpf ou cnpj



        if (value.length > 14) {

            value = value.slice(0, -1)
            //tira o numero se passar de 14

        }


        if (value.length > 11) {

            //cnpj 11.222.333/0001-11

            //expressao regular
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            //vai sair desse jeito (11.222333444455)

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            //(11.222.333444455)

            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            //(11.222.333/444455)

            value = value.replace(/(\d{4})(\d)/, "$1-$2")
            //(11.222.333/4444-55)


        } else {

            //cpf 111.222.333-44

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // 111.22233344

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            // 111.222.33344

            value = value.replace(/(\d{3})(\d)/, "$1-$2")
            // 111.222.333-44

        }


        return value

    },

    cep(value) {

        value = value.replace(/\D/g, "")

        if (value.length > 8) {

            value = value.slice(0, -1)
            //tira o numero se passar de 8

        }

        value = value.replace(/(\d{5})(\d)/, "$1-$2")


        return value

    }


}



function toggleIframe() {
    var iframe = document.querySelector("iframe")

    if (iframe.style.visibility === "visible") {

        iframe.style.visibility = "hidden"
        iframe.style.height = 0

    } else {

        iframe.style.visibility = "visible"
        iframe.style.height = "500px"
    }

};




// buttonOnClick(){

//     const button = document.querySelector(".show")
//     const iframe = document.querySelector("iframe")

//     button.addEventListener(onclick(
//         iframe.set
//     ))
// }
