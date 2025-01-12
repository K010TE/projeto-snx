// Importações necessárias
const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require('./auth');
const { sequelize, User, Post, Comment } = require('./models'); // Centralizando os modelos no models/index.js
require('dotenv').config();

const app = express();
const PORT = 3333;

app.use(express.json());

// Testa a conexão com o banco de dados
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexão com o banco bem-sucedida!');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco:', err.message);
        process.exit(1);
    });

// Endpoint de registro de usuários
app.post('/register', async (req, res) => {
    try {
        const { name, username, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).send('Username já está em uso.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            username,
            password: hashedPassword,
        });

        res.status(201).json({ id: newUser.id, name: newUser.name, username: newUser.username });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err.message);
        res.status(500).send('Erro ao registrar usuário.');
    }
});

// Endpoint de login de usuários
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).send('Usuário ou senha inválidos.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Usuário ou senha inválidos.');
        }

        const token = generateToken({ id: user.id, username: user.username });
        res.status(200).json({ token });
    } catch (err) {
        console.error('Erro ao fazer login:', err.message);
        res.status(500).send('Erro ao fazer login.');
    }
});

// Rota para buscar todos os posts com comentários
app.get('/posts', verifyToken, async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: Comment,
                as: 'comments',
            },
        });

        res.status(200).json(posts);
    } catch (err) {
        console.error('Erro ao buscar posts com comentários:', err.message);
        res.status(400).send('Erro ao buscar posts');
    }
});

// Rota para criar um post
app.post('/posts', verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.create({
            title,
            content,
            userId: req.user.id, // Obtém o ID do usuário do token JWT
            username: req.user.username, // Obtém o username do token JWT
        });

        res.status(201).json(post);
    } catch (err) {
        console.error('Erro ao criar post:', err.message);
        res.status(400).send('Erro ao criar post');
    }
});

// Rota para adicionar um comentário
app.post('/posts/:postId/comments', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }

        const comment = await Comment.create({
            content,
            postId,
            userId: req.user.id, // Obtém o ID do usuário do token JWT
            username: req.user.username, // Obtém o username do token JWT
        });

        res.status(201).json(comment);
    } catch (err) {
        console.error('Erro ao adicionar comentário:', err.message);
        res.status(400).send('Erro ao adicionar comentário');
    }
});

// Sincronização de tabelas
(async () => {
    try {
        await sequelize.sync({ alter: true }); // Sincroniza as tabelas sem perder dados
        console.log('Tabelas sincronizadas com sucesso!');
    } catch (err) {
        console.error('Erro ao sincronizar tabelas:', err.message);
        process.exit(1);
    }
})();

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
