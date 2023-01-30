export function getExecutionTime(inSeconds: boolean = false) {

    return function (
        target: any, //é um constructor num metodo statico, e um prototype se nao for statico
        propertyKey: string, //nome do metodo 
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value //metodo que vai ser aplicado o decorator

        descriptor.value = async function (...args: any[]) {//sobreescrevendo o metodo original
            let divisor = 1
            let unity = "milisegundos"

            if (inSeconds) {
                divisor = 1000
                unity = "segundos"
            }

            const t1 = performance.now()

            const functionReturn = await originalMethod.apply(this, args) // metodo original sendo executado

            const t2 = performance.now()

            console.log(`${propertyKey}, tempo de execução: ${(t2 - t1) / divisor} ${unity}`)


            return functionReturn //retorna o resultado do metodo original


        }

        return descriptor // é necessario?

    }


}