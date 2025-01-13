import { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [commentContent, setCommentContent] = useState({});
    const userId = localStorage.getItem('userId'); // Obtém o userId do localStorage

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/posts', {
                headers: { Authorization: `Bearer ${token}` },
            });
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
            setPosts(posts.filter((post) => post.id !== postId)); // Remove o post deletado da lista
            alert('Post deletado com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar post:', err);
            alert('Erro ao deletar post.');
        }
    };

    const handleCreateComment = async (e, postId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const content = commentContent[postId] || '';
            const response = await axios.post(
                `/api/posts/${postId}/comments`,
                { content },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, comments: [...post.comments, response.data] }
                        : post
                )
            );
            setCommentContent((prevState) => ({ ...prevState, [postId]: '' }));
            alert('Comentário adicionado com sucesso!');
        } catch (err) {
            console.error('Erro ao adicionar comentário:', err);
            alert('Erro ao adicionar comentário. Verifique as informações.');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove o comentário da lista
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: post.comments.filter((comment) => comment.id !== commentId),
                          }
                        : post
                )
            );
            alert('Comentário deletado com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar comentário:', err);
            alert('Erro ao deletar comentário.');
        }
    };

    const handleCommentChange = (postId, value) => {
        setCommentContent((prevState) => ({ ...prevState, [postId]: value }));
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

            {posts.length === 0 ? (
                <p>Não há posts disponíveis.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <p>
                            <strong>Autor:</strong> {post.username}
                        </p>
                        <h3>Comentários:</h3>
                        {post.comments && post.comments.length > 0 ? (
                            <ul>
                                {post.comments.map((comment) => (
                                    <li key={comment.id}>
                                        <p>{comment.content}</p>
                                        <p>
                                            <strong>Comentado por:</strong> {comment.username}
                                        </p>
                                        {/* Botão discreto para deletar comentário */}
                                        {comment.userId === Number(userId) && (
                                            <button
                                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'red',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                [Excluir Comentário]
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Sem comentários</p>
                        )}

                        {/* Botão de deletar post (apenas para o autor) */}
                        {post.userId === Number(userId) && (
                            <button
                                onClick={() => handleDeletePost(post.id)}
                                style={{ marginTop: '10px', color: 'red' }}
                            >
                                Deletar Post
                            </button>
                        )}

                        {/* Formulário para adicionar comentários */}
                        <form
                            onSubmit={(e) => handleCreateComment(e, post.id)}
                            style={{ marginTop: '10px' }}
                        >
                            <input
                                type="text"
                                placeholder="Adicione um comentário..."
                                value={commentContent[post.id] || ''}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                required
                            />
                            <button type="submit">Comentar</button>
                        </form>
                    </div>
                ))
            )}
        </div>
    );
};

export default Posts;
