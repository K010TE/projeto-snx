import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-layout">
                {/* Navbar fixa na lateral */}
                <Navbar />
                {/* Conteúdo principal ajustado */}
                <div className="app-content">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/posts" element={<Posts />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
