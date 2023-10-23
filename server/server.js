require('dotenv').config()
const express=require('express')
const http=require('http')
const path=require('path')
const socket=require('socket.io')
const cors=require('cors')
const port=process.env.PORT ||8000
const publicPath=path.join(__dirname,'/../public')
const {generateMessage, generateLocationMessage}=require('./utils/message')
const {Users}=require('./utils/users')
// console.log(__dirname+"/../public");
// console.log();
const app=express();
app.use(express.json())
app.use(express.static(publicPath))
app.use(cors())

const users=new Users()

let server=http.createServer(app)
let io=socket(server,{
    cors:{
        origin:"*"
    }
})
io.on("connection",(socket)=>{
    console.log("Connected:",socket.id);
    let isRealString=(string)=>{
        return typeof string ==="string" && string.trim().length>0
    }
    socket.on('joinRoom',(data,callback)=>{
        const params=JSON.parse(data)
        // console.log(typeof params.name);
        // console.log(isRealString(params.name));
        if(!isRealString(params.name)||!isRealString(params.room)){
            return callback("Name and Room is Invalid")
        }
        // console.log(params.room);
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id,params.name,params.room)
        // console.log(users);
        // console.log(users.getUserList(params.room));
        io.to(params.room).emit("updateUserList",users.getUserList(params.room))
        socket.emit('newMessage',generateMessage('Admin',`Welcome to ${params.room}`))
        socket.broadcast.to(params.room).emit("newMessage",generateMessage('Admin',"New User joined"))
    })

    
    socket.on('createMessage',(message,callback)=>{
        // console.log("CreateMessage:",message);
        // console.log(message.text)
        let user=users.getUser(socket.id)
        // console.log(message);
        if(user && isRealString(message.text)){
            io.to(user.room).emit("newMessage",generateMessage(user.name,message.text))
        }
        callback("Message Sent");
    })

    socket.on("createLocation",(location)=>{
        let user=users.getUser(socket.id)
        if(user){
            io.to(user.room).emit("newLocationMessage",generateLocationMessage(user.name,location.lat,location.lon))
        }
    })
    
    socket.on('disconnect',()=>{
        let user=users.removeUser(socket.id)
        // console.log(user);
        if(user){
            io.to(user.room).emit("updateUserList",users.getUserList(user.room))
            io.to(user.room).emit("newMessage",generateMessage('Admin',`${user.name} left the ${user.room}`))
        }
        console.log("User disconnected");
    })
})



server.listen(port,()=>{
    console.log(`Running at port ${port}`);
})