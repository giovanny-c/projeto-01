import { app } from "./app";


app.listen(
    process.env.PORT? Number(process.env.PORT) : 3333, 
    () => console.log(`Server is running on port ${process.env.PORT? Number(process.env.PORT) : 3333}`))
