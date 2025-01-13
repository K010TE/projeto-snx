//import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove os dados do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        
        //alert('Você saiu!');
        // Redireciona para a tela de login
        navigate('/');
    };

    return (
        <nav className="navbar">
            <ul className="navbar-links">
                <li>
                    <Link to="/">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>

                {/*
                <li>
                    <Link to="/posts">Posts</Link>
                </li>
                */}


            </ul>
            <div className="user-info">
                <span className="user-icon">👤</span>
                <span className="username">
                    Usuário: {username || 'Visitante'}
                </span>
                {username && (
                    <button className="logout-button" onClick={handleLogout}>
                        Sair
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
