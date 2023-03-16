

export default interface ICacheProvider {

    get<T>(value: string): Promise<T | undefined> 
    set<T>(key: string, value: string): Promise<T | undefined> 
    delete<T>(key: string): Promise<T | undefined> 
//     addInCart<T>(item_id: string, user_id: string): Promise<T | undefined>
//     getCart<T>(user_id: string): Promise<T | undefined>
//     decreaseInCart<T>(item_id: string, user_id: string): Promise<T | undefined>
//     delInCart<T>(item_id: string, user_id: string): Promise<T | undefined>
//     delCart<T>(user_id: string): Promise<T | undefined>
}