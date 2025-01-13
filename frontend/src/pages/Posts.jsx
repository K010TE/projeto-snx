import { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token'); // Recupera o token do localStorage
            const response = await axios.get('/api/posts', {
                headers: {
                    Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                },
            });
            setPosts(response.data);
        } catch (err) {
            console.error(err);
            alert('Erro ao buscar posts.');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Posts</h1>
            {posts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p><strong>Autor:</strong> {post.username}</p>
                    <h3>Comentários:</h3>
                    <ul>
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <li key={comment.id}>
                                    <p>{comment.content}</p>
                                    <p><strong>Comentário por:</strong> {comment.username}</p>
                                </li>
                            ))
                        ) : (
                            <p>Sem comentários</p>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Posts;
