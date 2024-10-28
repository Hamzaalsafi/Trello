import 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './app.css';
import { Bord } from './Bord';
import { Home } from './Home';
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
  const Loginctl = '/Trello';

  return (
    <div className="app">
      {location.pathname !== Loginctl && <NavBar />}
      <Routes>
        <Route path="/Trello/Home" element={<Home/>} />
        <Route path="/Trello" element={<Login />} />
        <Route path="Trello/Board/:id" element={<Bord />} />
      </Routes>
    </div>
  );
}

export default App;
