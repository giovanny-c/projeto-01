import moment from "moment"

function getFormatedDateForReceipt(date: Date){
       
    const [dia, mes, ano] =  moment(date).locale("pt-br").format("DD MMMM YY").split(" ")
    
    return {
        dia,
        mes,
        ano
    }
}

export {getFormatedDateForReceipt}