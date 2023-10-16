let socket = io();
// const message={
//     from :"Nikhil",
//     text:"Hi bro"
// }

socket.on("connect", () => {
  console.log("Connected To server");
});
// socket.emit("createMessage",message,(a)=>{
//   console.log(a);
// })

socket.on("newMessage",(message)=>{
  console.log(message);
  let li=document.createElement('li')
  li.innerText=`${message.from}:${message.text}`
  document.querySelector('body').appendChild(li)
})
socket.on("newLocationMessage",(message)=>{
  console.log(message);
  let li=document.createElement('li')
  let a=document.createElement('a')
  a.setAttribute('target','_blank')
  a.setAttribute('href',message.url)
  a.innerHTML=`${message.from}:My Current Location`
  li.appendChild(a)
  document.querySelector('body').appendChild(li)
})

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
document.querySelector('#submit').addEventListener('click',(e)=>{
  e.preventDefault()
  socket.emit('createMessage',{
    from:"User",
    text:document.querySelector('input[name="message"]').value
  },(message)=>{console.log(message)})
})

document.querySelector('#sendLocation').addEventListener('click',(e)=>{
  if(!navigator.geolocation){
    return alert('Geolocation is not supported in your browser')
  }
  navigator.geolocation.getCurrentPosition((position)=>{
    console.log(position);
    socket.emit("createLocation",{
      lat:position.coords.latitude,
      lon:position.coords.longitude
    })
  },()=>{
    alert("Unable to fetch loaction")
  })
})