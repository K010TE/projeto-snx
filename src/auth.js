const jwt = require('jsonwebtoken');

// Chave secreta (use uma variável de ambiente para produção)
const SECRET_KEY = 'sua_chave_secreta'; // Substitua por uma variável de ambiente

// Gera um token JWT
const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Token válido por 1 hora
};

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Token não fornecido');
    }

    const token = authHeader.split(' ')[1]; // Formato esperado: "Bearer <token>"
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token inválido');
        }

        req.user = decoded; // Adiciona os dados decodificados ao objeto req
        next();
    });
};

module.exports = { generateToken, verifyToken };
