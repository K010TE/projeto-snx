import { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const userId = localStorage.getItem('userId'); // Obtém o userId do localStorage como string

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/posts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Posts retornados pelo backend:', response.data);
            setPosts(response.data);
        } catch (err) {
            console.error('Erro ao buscar posts:', err);
            alert('Erro ao buscar posts.');
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                '/api/posts',
                { title, content },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPosts([response.data, ...posts]);
            setTitle('');
            setContent('');
            alert('Post criado com sucesso!');
        } catch (err) {
            console.error('Erro ao criar post:', err);
            alert('Erro ao criar post. Verifique as informações.');
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(posts.filter((post) => post.id !== postId));
            alert('Post deletado com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar post:', err);
            alert('Erro ao deletar post.');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Posts</h1>

            {/* Formulário para criar posts */}
            <form onSubmit={handleCreatePost} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Conteúdo"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Criar Post</button>
            </form>

            {/* Listagem de posts */}
            {posts.length === 0 ? (
                <p>Não há posts disponíveis.</p>
            ) : (
                posts.map((post) => {
                    console.log('Post UserId:', post.userId, 'Logged UserId:', userId);
                    return (
                        <div key={post.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            <p><strong>Autor:</strong> {post.username}</p>
                            <h3>Comentários:</h3>
                            {post.comments && post.comments.length > 0 ? (
                                <ul>
                                    {post.comments.map((comment) => (
                                        <li key={comment.id}>
                                            <p>{comment.content}</p>
                                            <p><strong>Comentado por:</strong> {comment.username}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Sem comentários</p>
                            )}

                            {/* Exibe o botão de deletar apenas para o autor */}
                            {post.userId === Number(userId) && (
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    style={{ marginTop: '10px', color: 'red' }}
                                >
                                    Deletar Post
                                </button>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default Posts;
