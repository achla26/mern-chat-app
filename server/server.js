import 'dotenv/config';
import app from "./app.js";
import { Server } from "socket.io";
import http from "http";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server,{
    cors : {
        origin : "*"
    }
});
 

server.listen(port , ()=>{
    console.log(`Server is running on ${port}`)
});