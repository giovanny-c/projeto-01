

function splitDate(date){


    date = new Date(date)
       

    let year = date.getFullYear() // number
    let month = `0${date.getUTCMonth() + 1}`.slice(-2) //string
    let day = `0${date.getUTCDate()}`.slice(-2);
    let hour = `0${date.getHours()}`.slice(-2)
    let minutes = `0${date.getMinutes()}`.slice(-2)

    return {
        year,
        month,
        day,
        hour,
        minutes
    }
}

export {splitDate}