
// formata para 12 98765-4321 ou 98765-4321 ou 8765-4321
// com parenteses  para (12) 98765-4321


export default function formatPhone(phone: string, paranthese: boolean): string{

    phone = phone.replace(/\D/g, "")

    // phone = phone.replace(/\d+(\d{11}$)/g, '$2')
    
   
    

    if (phone.length > 10) {
        //se phone = 11987654321
        
        phone = phone.replace(/^\d+(\d{11}$)/, '$1') //pega todos os digitos e substitui pelos 11 ultimos 
        .replace(/^(\d)/, `($1`) // busca o 1 digito e subistitui por (1 
        .replace(/^(\(\d{2})(\d)/, `$1) $2`) // busca o primeiro e segundo junto do "("  E o proximo digito e substitui por (11) 9
        .replace(/(\d{5})(\d{1,5})/, '$1-$2')//busca os uma cadeia de 5 digitos e uma de 4 e junta 98765-4321
        .replace(/(-\d{4})\d+?$/, '$1')//se tiver mais de 4 digitos no final da cadeia tira o sobresalente apos os -4321
        // (11) 98765-4321
        if(!paranthese){

            return phone.replace(/[\(\)]/g,"") // tira os parenteses
        }

        return phone
    }
    if (phone.length === 10) {
        //se phone = 1187654321
        phone = phone.replace(/^\d+(\d{10}$)/, '$1') //pega todos os digitos e substitui pelos 10 ultimos 
        .replace(/^(\d)/, `($1`) // busca o 1 digito e poe e subistitui por (1 
        .replace(/^(\(\d{2})(\d)/, `$1) $2`) // busca o primeiro e segundo junto do "("  E o proximo digito e substitui por (11) 8
        .replace(/(\d{4})(\d{1,5})/, '$1-$2')//busca os uma cadeia de 5 digitos e uma de 4 e junta 8765-4321
        .replace(/(-\d{4})\d+?$/, '$1')//se tiver mais de 4 digitos no final da cadeia tira o sobresalente apos os -4321

        // (11) 8765-4321
        if(!paranthese){

            return phone.replace(/[\(\)]/g,"") // tira os parenteses
        }

        return phone
    }
        
    if (phone.length === 9) {
        phone = phone.replace(/^\d+(\d{9}$)/, '$1')
        .replace(/(\d{5})(\d{1,5})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
        //98765-4321
        return phone
    }
    if (phone.length < 9) {
        
        phone = phone.replace(/^\d+(\d{8}$)/, '$1')
        .replace(/(\d{4})(\d{1,5})/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
        //98765-4321
        return phone
    }


    
}