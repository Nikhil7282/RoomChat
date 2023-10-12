require('dotenv').config()
const express=require('express')
const http=require('http')
const path=require('path')
const socket=require('socket.io')
const cors=require('cors')
const port=process.env.PORT ||8000
const publicPath=path.join(__dirname,'/../public')
// console.log(__dirname+"/../public");
// console.log();
const app=express();
app.use(express.static(publicPath))
app.use(cors())

let server=http.createServer(app)
let io=socket(server,{
    cors:{
        origin:"*"
    }
})
io.on("connection",(socket)=>{
    console.log("Connected:",socket.id);
    // socket.emit("response",()=>{

    // })
})



server.listen(port,()=>{
    console.log(`Running at port ${port}`);
})