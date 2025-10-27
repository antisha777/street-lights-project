import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          🚦 Уличное освещение
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">
            Главная
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;