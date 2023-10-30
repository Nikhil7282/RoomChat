let socket = io();

const params=window.location.search
// console.log(params);
const query=new URLSearchParams(params)
const data=JSON.stringify(Object.fromEntries(query))
console.log(JSON.parse(data).name);


socket.emit("joinRoom",data,(err)=>{
  if(err){
    alert(err)
    window.location.href='/'
  }
  else{
    console.log("No Error");
  }
})

function scrollToBottom(){
  let messages=document.querySelector('#messages').lastElementChild
  messages.scrollIntoView();
  // console.log(messages);
}

socket.on("connect", () => {
  console.log("Connected To server");
});
// socket.emit("createMessage",message,(a)=>{
//   console.log(a);
// })

socket.on("newMessage",(message)=>{
  const template=document.querySelector('#message-template').innerHTML
  // console.log(template);
  const html=Mustache.render(template,{
    from:message.from,
    text:message.text,
    createdAt:moment(message.createdAt).format('LT')
  })
  const div=document.createElement('div')
  div.innerHTML=html
  document.querySelector('#messages').appendChild(div)
    // const formattedTime=moment(message.createdAt).format('LT')
  // console.log(message);
  // let li=document.createElement('li')
  // li.innerText=`${message.from} ${formattedTime}:${message.text}`
  // document.querySelector('body').appendChild(li)
  scrollToBottom()
})

// socket.on('userCount',(count)=>{
//   console.log(count);
// })

socket.on('updateUserList',(users)=>{
  let ol=document.createElement('ol')
  users.forEach((user)=>{
    let li=document.createElement('li')
    li.innerHTML=user
    ol.appendChild(li)
  })
  let userList=document.querySelector('#users')
  userList.innerHTML=""
  userList.appendChild(ol)
  console.log(users);
})

socket.on("newLocationMessage",(message)=>{
  const formattedTime=moment(message.createdAt).format('LT')
  console.log(message);

  const template=document.querySelector('#location-message-template').innerHTML
  const html=Mustache.render(template,{
    from:message.from,
    url:message.url,
    createdAt:formattedTime
  })
  const div=document.createElement('div')
  div.innerHTML=html
  document.querySelector('#messages').appendChild(div)
  // let li=document.createElement('li')
  // let a=document.createElement('a')
  // li.innerText=`${message.from} ${formattedTime}:`
  // a.setAttribute('target','_blank')
  // a.setAttribute('href',message.url)
  // a.innerHTML=`My Current Location`
  // li.appendChild(a)
  // document.querySelector('body').appendChild(li)
  scrollToBottom()
})

document.querySelector('#submit-btn').addEventListener('click',(e)=>{
  e.preventDefault()
  socket.emit('createMessage',{
    from:`${JSON.parse(data).name}`,
    text:document.querySelector('input[name="message"]').value
  },(message)=>{console.log(message)})
  document.querySelector('input[name="message"]').value=""
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

const modelOpen=document.querySelector("#exit-chat")
// console.log(modelOpen);
const modelClose=document.querySelectorAll("[data-close-modal]")
const model=document.querySelector(".modal")

modelOpen.addEventListener('click',()=>{
  model.showModal()
})
modelClose[0].addEventListener('click',()=>{
  model.close()
  window.location.href="/"
})
modelClose[1].addEventListener('click',()=>{
  model.close()
})




// document.querySelector('#exit-chat').addEventListener('click',()=>{
//   if(confirm("Do you want to exit the chat?")){
//     window.location.href="/"
//   }
//   else{
//     return;
//   }
// })

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});