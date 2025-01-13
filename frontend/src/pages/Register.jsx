import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/register', { username, password, name });
            alert('Cadastro realizado com sucesso!');
            navigate('/');
        } catch (err) {
            console.error('Erro ao cadastrar:', err);
            alert('Erro ao cadastrar. Tente novamente.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Cadastro</h1>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Cadastrar</button>
                </form>
                <div className="login-redirect">
                    Já possui uma conta? <a href="/">Faça login</a>
                </div>
            </div>
        </div>
    );
};

export default Register;
