
export function inspect() {

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value

        descriptor.value = async function (...args: any[]) {
            console.log(`--- Método ${propertyKey}`)

            args.forEach(value => {

                console.log(`------- Parâmetros: ${Object.keys(value)}: ${Object.values(value)}`)
            });

            const functionReturn = await originalMethod.apply(this, args)

            console.log(`------- Retorno: ${JSON.stringify(functionReturn)}`)

            return functionReturn
        }

        //return descriptor
    }
}