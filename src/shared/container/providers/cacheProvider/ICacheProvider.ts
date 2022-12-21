

export default interface ICacheProvider {

    getRedis<T>(value: string): T | undefined
    setRedis<T>(key: string, value: string): T | undefined
    delRedis<T>(key: string): T | undefined
    addInCart<T>(item_id: string, user_id: string): Promise<T | undefined>
    getCart<T>(user_id: string): Promise<T | undefined>
    decreaseInCart<T>(item_id: string, user_id: string): Promise<T | undefined>
    delInCart<T>(item_id: string, user_id: string): Promise<T | undefined>
    delCart<T>(user_id: string): Promise<T | undefined>
}