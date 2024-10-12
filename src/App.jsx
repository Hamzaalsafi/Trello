import { useState } from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './app.css';
import { Bord } from './Bord'; 
import { NavBar } from './NavBar';
import { Login } from './Login';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const Loginurl = '/';

  return (
    <div className="app">
      {location.pathname !== Loginurl && <NavBar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Bord" element={<Bord />} />
      </Routes>
    </div>
  );
}

export default App;
