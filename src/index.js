const express = require('express');
const { Pool } = require('pg');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const sequelize = require('./database');
const { verifyToken, generateToken } = require('./auth'); // Middleware e função de geração de token
const bcrypt = require('bcrypt');
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

// Simula um banco de usuários
const users = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('123456', 10) },
    { id: 2, username: 'user', password: bcrypt.hashSync('senha123', 10) },
];

// Rota de login para autenticação e geração de token JWT
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user) {
        return res.status(401).send('Usuário ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send('Usuário ou senha inválidos');
    }

    // Gera o token JWT
    const token = generateToken({ id: user.id, username: user.username });
    return res.status(200).json({ token });
});

// Rota pública para teste
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

// Rotas protegidas com o middleware verifyToken
app.get('/posts', verifyToken, async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: { model: Comment, as: 'comments' }, // Inclui os comentários
        });

        return res.status(200).json(posts);
    } catch (err) {
        console.error('Erro ao buscar posts com comentários:', err.message);
        return res.status(400).send('Erro ao buscar posts');
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

        return res.status(200).json(post);
    } catch (err) {
        console.error('Erro ao buscar post com comentários:', err.message);
        return res.status(400).send('Erro ao buscar post');
    }
});

app.post('/posts', verifyToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.create({ title, content });
        return res.status(201).json(post);
    } catch (err) {
        console.error('Erro ao criar post:', err.message);
        return res.status(400).send('Erro ao criar post');
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
        return res.status(201).json(comment);
    } catch (err) {
        console.error('Erro ao adicionar comentário:', err.message);
        return res.status(400).send('Erro ao adicionar comentário');
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
        return res.status(200).json(post);
    } catch (err) {
        console.error('Erro ao atualizar post:', err.message);
        return res.status(400).send('Erro ao atualizar post');
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
        return res.status(200).send('Post deletado com sucesso');
    } catch (err) {
        console.error('Erro ao deletar post:', err.message);
        return res.status(400).send('Erro ao deletar post');
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
        process.exit(1); // Finaliza o processo em caso de erro
    }
})();

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});
