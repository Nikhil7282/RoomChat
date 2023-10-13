let socket = io();
const message={
    from :"Nikhil",
    msg:"Hi bro"
}

socket.on("connect", () => {
  console.log("Connected To server");
socket.emit("createMessage",message)
socket.on("newMessage",(message)=>{
    console.log(message);
})
});


socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
