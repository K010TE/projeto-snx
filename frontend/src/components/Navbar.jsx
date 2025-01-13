//import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    // Busca o username do localStorage
    const username = localStorage.getItem('username');

    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li>
                    <Link to="/">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/posts">Posts</Link>
                </li>
            </ul>
            {/* Exibe o username como "Usuário: username" */}
            <div className="user-info">
                <span className="user-icon">👤</span>
                <span className="username">
                    User: {username || 'Visitante'}
                </span>
            </div>
        </nav>
    );
};

export default Navbar;
