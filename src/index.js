const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { generateToken, verifyToken } = require('./auth');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const User = require('./models/User'); // Modelo de usuário
const sequelize = require('./database');
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
        await User.sync();
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
    console.log(`Servidor rodando na porta ${PORT}`);
});
