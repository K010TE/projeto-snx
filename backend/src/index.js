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

        // Procura o usuário pelo username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).send('Usuário ou senha inválidos.');
        }

        // Verifica se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Usuário ou senha inválidos.');
        }

        // Gera o token JWT
        const token = generateToken({ id: user.id, username: user.username });

        // Retorna o token e o userId
        res.status(200).json({ token, userId: user.id });
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

app.delete('/posts/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Obtém o ID do usuário logado a partir do token

        // Busca o post pelo ID
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }

        // Verifica se o usuário logado é o autor do post
        if (post.userId !== userId) {
            return res.status(403).send('Você não tem permissão para deletar este post');
        }

        // Deleta o post
        await post.destroy();
        return res.status(200).send('Post deletado com sucesso');
    } catch (err) {
        console.error('Erro ao deletar post:', err.message);
        return res.status(500).send('Erro ao deletar post');
    }
});

app.delete('/posts/:postId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id; // Obtém o ID do usuário logado do token

        // Busca o comentário pelo ID
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).send('Comentário não encontrado');
        }

        // Verifica se o usuário logado é o autor do comentário
        if (comment.userId !== userId) {
            return res.status(403).send('Você não tem permissão para deletar este comentário');
        }

        // Deleta o comentário
        await comment.destroy();
        res.status(200).send('Comentário deletado com sucesso');
    } catch (err) {
        console.error('Erro ao deletar comentário:', err.message);
        res.status(500).send('Erro ao deletar comentário');
    }
});

app.put('/posts/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).send('Post não encontrado.');
        }

        // Verifica se o usuário que está tentando editar é o autor do post
        if (post.userId !== req.user.id) {
            return res.status(403).send('Você não tem permissão para editar este post.');
        }

        // Atualiza o post
        await post.update({ title, content });

        res.status(200).json(post); // Retorna o post atualizado
    } catch (err) {
        console.error('Erro ao atualizar post:', err.message);
        res.status(500).send('Erro ao atualizar post.');
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
