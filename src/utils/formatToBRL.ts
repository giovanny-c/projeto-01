import Intl from "intl"

export default function formatToBRL(number: number) {

    const formatter = new Intl.NumberFormat("pt-BR",
        {
            style: "currency",
            currency: "BRL",

        })

    const formatedNumber = formatter.format(number)

    return formatedNumber
}



