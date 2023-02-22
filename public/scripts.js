


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
