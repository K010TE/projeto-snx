import { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [commentContent, setCommentContent] = useState({});
    const [editPostId, setEditPostId] = useState(null);
    const [editComment, setEditComment] = useState({});
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const userId = localStorage.getItem('userId');

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
            alert('Erro ao criar post.');
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

    const handleEditPost = async (e, postId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `/api/posts/${postId}`,
                { title: editTitle, content: editContent },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, title: editTitle, content: editContent }
                        : post
                )
            );
            setEditPostId(null);
            alert('Post editado com sucesso!');
        } catch (err) {
            console.error('Erro ao editar post:', err);
            alert('Erro ao editar post.');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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

    const handleEditComment = async (e, postId, commentId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const updatedContent = commentContent[commentId];
            await axios.put(
                `/api/posts/${postId}/comments/${commentId}`,
                { content: updatedContent },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: post.comments.map((comment) =>
                                  comment.id === commentId
                                      ? { ...comment, content: updatedContent }
                                      : comment
                              ),
                          }
                        : post
                )
            );
            setEditComment((prevState) => ({ ...prevState, [commentId]: false }));
            alert('Comentário editado com sucesso!');
        } catch (err) {
            console.error('Erro ao editar comentário:', err);
            alert('Erro ao editar comentário.');
        }
    };

    const handleCommentChange = (postId, value) => {
        setCommentContent((prevState) => ({ ...prevState, [postId]: value }));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="posts-container">
            <h1 className="posts-header">Posts</h1>

            <form className="post-form" onSubmit={handleCreatePost}>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="form-input"
                    placeholder="Conteúdo"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>
                <button className="btn btn-primary" type="submit">
                    Criar Post
                </button>
            </form>

            {posts.length === 0 ? (
                <p className="text-center">Não há posts disponíveis.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <h2 className="post-title">{post.title}</h2>
                        <p className="post-content">{post.content}</p>
                        <p className="post-author">
                            <strong>Autor:</strong> {post.username}
                        </p>
                        {post.userId === Number(userId) && (
                            <div className="post-actions">
                                <button
                                    onClick={() => {
                                        setEditPostId(post.id);
                                        setEditTitle(post.title);
                                        setEditContent(post.content);
                                    }}
                                    className="btn btn-edit"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="btn btn-danger"
                                >
                                    Deletar
                                </button>
                            </div>
                        )}
                        {editPostId === post.id && (
                            <form
                                onSubmit={(e) => handleEditPost(e, post.id)}
                                className="edit-post-form"
                            >
                                <input
                                    type="text"
                                    placeholder="Novo título"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    required
                                />
                                <textarea
                                    placeholder="Novo conteúdo"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    required
                                ></textarea>
                                <button type="submit" className="btn btn-primary">
                                    Salvar
                                </button>
                            </form>
                        )}
                        <h3 className="comments-header">Comentários:</h3>
                        {post.comments && post.comments.length > 0 ? (
                            <ul className="comments-list">
                                {post.comments.map((comment) => (
                                    <li key={comment.id} className="comment-item">
                                        {editComment[comment.id] ? (
                                            <form
                                                onSubmit={(e) =>
                                                    handleEditComment(e, post.id, comment.id)
                                                }
                                            >
                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    defaultValue={comment.content}
                                                    onChange={(e) =>
                                                        setCommentContent((prevState) => ({
                                                            ...prevState,
                                                            [comment.id]: e.target.value,
                                                        }))
                                                    }
                                                    required
                                                />
                                                <button className="btn btn-primary" type="submit">
                                                    Salvar
                                                </button>
                                            </form>
                                        ) : (
                                            <>
                                                <p className="comment-content">
                                                    {comment.content}
                                                </p>
                                                <p className="comment-author">
                                                    <strong>Comentado por:</strong>{' '}
                                                    {comment.username}
                                                </p>
                                                {comment.userId === Number(userId) && (
                                                    <div className="comment-actions">
                                                        <button
                                                            onClick={() =>
                                                                setEditComment((prevState) => ({
                                                                    ...prevState,
                                                                    [comment.id]: true,
                                                                }))
                                                            }
                                                            className="btn btn-edit"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    post.id,
                                                                    comment.id
                                                                )
                                                            }
                                                            className="btn btn-danger"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Sem comentários</p>
                        )}
                        <form
                            onSubmit={(e) => handleCreateComment(e, post.id)}
                            className="comment-form"
                        >
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Adicione um comentário..."
                                value={commentContent[post.id] || ''}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                required
                            />
                            <button className="btn btn-primary" type="submit">
                                Comentar
                            </button>
                        </form>
                    </div>
                ))
            )}
        </div>
    );
};

export default Posts;
