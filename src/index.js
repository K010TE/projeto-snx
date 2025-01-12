const express = require('express');
const { Pool } = require('pg');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const sequelize = require('./database');
const { verifyToken, generateToken } = require('./auth');
require('dotenv').config();

const PORT = 3333;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false, // Aceita certificados autoassinados (se necessário)
    },
});

const app = express();
app.use(express.json());

// Simula um banco de usuários para autenticação
const users = [
    { id: 1, username: 'admin', password: '123456' }, // Em produção, use senhas criptografadas
];

// Rota de login para autenticação
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user || user.password !== password) {
        return res.status(401).send('Usuário ou senha inválidos');
    }

    // Gera o token JWT
    const token = generateToken({ id: user.id, username: user.username });
    res.status(200).json({ token });
});

// Rota pública para teste
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// Rotas protegidas com o middleware verifyToken
app.get('/posts', verifyToken, async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: { model: Comment, as: 'comments' },
        });
        res.status(200).json(posts);
    } catch (err) {
        res.status(400).send('Erro ao buscar posts');
    }
});

app.get('/posts/:postId', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findByPk(postId, {
            include: { model: Comment, as: 'comments' },
        });
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(400).send('Erro ao buscar post');
    }
});

app.post('/posts', verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.create({ title, content });
        res.status(201).json(post);
    } catch (err) {
        res.status(400).send('Erro ao criar post');
    }
});

app.post('/posts/:postId/comments', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        const comment = await Comment.create({ content, postId });
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).send('Erro ao adicionar comentário');
    }
});

app.put('/posts/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        await post.update({ title, content });
        res.status(200).json(post);
    } catch (err) {
        res.status(400).send('Erro ao atualizar post');
    }
});

app.delete('/posts/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        await post.destroy();
        res.status(200).send('Post deletado com sucesso');
    } catch (err) {
        res.status(400).send('Erro ao deletar post');
    }
});

// Sincronização de tabelas
(async () => {
    try {
        await Post.sync();
        await Comment.sync();
        console.log('Tabelas sincronizadas com sucesso!');
    } catch (err) {
        console.error('Erro ao sincronizar tabelas:', err.message);
        process.exit(1);
    }
})();

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});
