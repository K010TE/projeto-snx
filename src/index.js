const express = require('express')
const { Pool } = require('pg')
const Post = require('./models/Post');
const Comment = require('./models/Comment')
const sequelize = require('./database');
require('dotenv').config()

const PORT = 3333

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false, // Aceita certificados autoassinados (se necessário)
    },
});


const app = express()

app.use(express.json())


// Testa a conexão com o banco de dados
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexão com o banco bem-sucedida!');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco:', err.message);
        process.exit(1); // Finaliza o processo caso a conexão falhe
    });




app.get('/', (req, res) => {
    console.log('Mensagem')
})

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll();
        return res.status(200).json(posts);
    } catch (err) {
        console.error('Erro ao buscar posts:', err.message);
        return res.status(400).send('Erro ao buscar posts');
    }
});

app.get('/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // Busca o post pelo ID e inclui os comentários associados
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



/*

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1;');
        console.log('Conexão bem-sucedida!');
        return res.status(200).send('Conexão com o banco bem-sucedida!');
    } catch (error) {
        console.error('Erro ao conectar ao banco:', error.message);
        return res.status(500).send('Erro ao conectar ao banco');
    }
});

*/

app.post('/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.create({ title, content });
        return res.status(201).json(post);
    } catch (err) {
        console.error('Erro ao criar post:', err.message);
        return res.status(400).send('Erro ao criar post');
    }
});

app.post('/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        // Verifica se o post existe
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }

        // Cria o comentário associado ao post
        const comment = await Comment.create({ content, postId });
        return res.status(201).json(comment);
    } catch (err) {
        console.error('Erro ao adicionar comentário:', err.message);
        return res.status(400).send('Erro ao adicionar comentário');
    }
});



app.put('/posts/:id', async (req, res) => {
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


app.delete('/posts/:id', async (req, res) => {
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


(async () => {
    try {
        // Sincronizar as tabelas `Post` e `Comment`
        await Post.sync();
        await Comment.sync();
        console.log('Tabelas sincronizadas com sucesso!');
    } catch (err) {
        console.error('Erro ao sincronizar tabelas:', err.message);
        process.exit(1); // Finaliza o processo em caso de erro
    }
})();





app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`)
})