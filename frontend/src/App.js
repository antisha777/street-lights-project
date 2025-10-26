import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StreetDetail from './components/StreetDetail';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/street/:streetId" element={<StreetDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;