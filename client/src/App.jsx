import './App.css'
import io from 'socket.io-client'
const socket=io.connect('http://localhost:8000')
console.log(socket);
socket.on("connect", () => {
  console.log("Connected", socket.connected);
});

function App() {

  return (
    <>
      <h1>Hello</h1>
    </>
  )
}

export default App
