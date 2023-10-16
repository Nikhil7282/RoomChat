require('dotenv').config()
const express=require('express')
const http=require('http')
const path=require('path')
const socket=require('socket.io')
const cors=require('cors')
const port=process.env.PORT ||8000
const publicPath=path.join(__dirname,'/../public')
const {generateMessage, generateLocationMessage}=require('./utils/message')
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
    socket.emit('newMessage',generateMessage('Admin',"Welcome to the chat"))
    socket.broadcast.emit("newMessage",generateMessage('Admin',"New User joined"))
    socket.on('createMessage',(message,callback)=>{
        // console.log("CreateMessage:",message);
        // console.log(message.text)
        console.log(message);
        socket.broadcast.emit("newMessage",generateMessage(message.from,message.text))
        callback("Message Sent");
    })

    socket.on("createLocation",(location)=>{
        socket.broadcast.emit("newLocationMessage",generateLocationMessage('Admin',location.lat,location.lon))
    })
    
    socket.on('disconnect',()=>{
        socket.broadcast.emit("newMessage",generateMessage('Admin',"User left the chat"))
        console.log("User disconnected");
    })
})



server.listen(port,()=>{
    console.log(`Running at port ${port}`);
})