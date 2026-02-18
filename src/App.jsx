import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getCharacters, postAddCharacter } from './api/fetch.js'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => getCharacters()}>Get /characters</button>
      <div id="include"></div>
      <button onClick={() => postAddCharacter()}>Post /addCharacter</button>
      <input id="firstname"></input>
      <input id="lastname"></input>
      <input id="universe"></input>
    </>
  )
}

export default App
