const jwt = require('jsonwebtoken');

// Chave secreta (use variável de ambiente para produção)
const SECRET_KEY = process.env.JWT_SECRET || 'sua_chave_secreta';

/**
 * Gera um token JWT com tempo de expiração
 * @param {Object} payload - Dados a serem armazenados no token
 * @returns {string} - Token JWT gerado
 */
const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Expira em 1 hora
};

/**
 * Middleware para verificar o token JWT
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Próxima função middleware
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Token não fornecido');
    }

    const token = authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            // Verifica se o erro é de expiração
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Token expirado');
            }
            return res.status(401).send('Token inválido');
        }

        req.user = decoded; // Adiciona os dados do token decodificado ao objeto req
        next(); // Prossegue para a próxima middleware ou rota
    });
};

module.exports = { generateToken, verifyToken, SECRET_KEY };
