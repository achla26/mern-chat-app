import 'dotenv/config';
 
import  connectDB  from "./db/index.js"
import { server } from './app.js'; // Import server instead of app

connectDB()
.then(() => {
    server.on("error", (error) => { // Use server instead of app
        console.log("ERRR: ", error);
        throw error;
    });

    server.listen(process.env.PORT || 8000, () => { // Use server.listen
        console.log(`Server is running at port : ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("MONGODB Connection FAILED ", err);
});