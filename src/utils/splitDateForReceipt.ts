import moment from "moment"

function getFormatedDateForReceipt(date: Date){
       
    const [dia, mes, ano] =  moment(date).locale("pt-br").format("DD MMMM YY").split(" ")
    
    return {
        dia,
        mes,
        ano
    }
}

function getFormatedDateForMessages(date: Date | string){
    const [dia, mes] =  moment(date).locale("pt-br").format("DD MMMM").split(" ")

    return `${dia}/${mes}` 
}

export {getFormatedDateForReceipt, getFormatedDateForMessages}