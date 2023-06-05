

export default function splitFor2Lines(string: string, line_1_lenght: number, line_2_lenght: number){
            
    let stringArray = string.split(" ")

    let first_line: string[] = [], second_line: string[] = []
    
    let actual_lenght = 0
    
    stringArray.forEach((name) => {
        
        actual_lenght += name.length

        
        if(actual_lenght > line_1_lenght && actual_lenght <= line_1_lenght + line_2_lenght){
            //se for maior que a linha e menor que a linha 1 + 2, poe na linha 2

            second_line.push(name)

            actual_lenght ++
        }

        if(actual_lenght === line_1_lenght){
            //se for igual a linha
            first_line.push(name)//poe na linha 1
        }

        if(actual_lenght < line_1_lenght){
            //se for 1 menor que a linha
            first_line.push(name)//poe na linha 1

            
            actual_lenght ++ //aumenta 1
            
        }

    });

    return {
        first_line: first_line.join(" "), 
        second_line: second_line.join(" ")
    }
}