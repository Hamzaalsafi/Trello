import { useState } from 'react'

import './app.css'
import { Bord } from './Bord'; 
import {NavBar} from './NavBar';
function App() {
 

  return (
    <div className="app">
    <NavBar />
      <Bord />
    </div>
  )
}

export default App
