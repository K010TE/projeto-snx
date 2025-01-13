//import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const username = localStorage.getItem('username'); // Obtém o username armazenado no localStorage

    return (
        <nav className="navbar">
            {/* Links de navegação */}
            <Link to="/" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
            <Link to="/posts" className="nav-link">Posts</Link>

            {/* Informações do usuário logado */}
            <div className="user-info">
                {username ? (
                    <>
                        <span className="user-icon">👤</span>
                        <span className="username">{username}</span>
                    </>
                ) : (
                    <span className="guest">Visitante</span>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
