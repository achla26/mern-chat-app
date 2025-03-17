import 'dotenv/config';

import dotenv from "dotenv"
import  connectDB  from "./db/index.js"
import app from './app.js'


connectDB()
.then(()=>{
    app.on("errror", (error) => {
        console.log("ERRR: ", error);
        throw error
    }) 

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB Connection FAILED ", err);
})