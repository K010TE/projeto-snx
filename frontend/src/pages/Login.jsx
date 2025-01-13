import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { username, password });

            // Armazena o token, userId e username no localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('username', username); // Armazena o username aqui

            alert('Login realizado com sucesso!');
            navigate('/posts'); // Navega para a página de posts após login
        } catch (err) {
            console.error('Erro no login:', err);
            alert('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Login</h1>
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        className="form-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="btn btn-primary" type="submit">
                        Entrar
                    </button>
                </form>
                <p className="register-link">
                    Não possui login? <Link to="/register">Se cadastre aqui</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
