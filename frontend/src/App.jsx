import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<div>Register Page</div>} />
                <Route path="/posts" element={<div>Posts Page</div>} />
            </Routes>
        </Router>
    );
};

export default App;
