const { DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define o modelo "Post"
const Post = sequelize.define(
    'Post',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'posts',
        timestamps: false, // Desativa os campos automáticos createdAt e updatedAt
    }
);

// Importa o modelo "Comment" para definir o relacionamento
const Comment = require('./Comment');

// Relacionamento: Um post tem muitos comentários
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Exporta o modelo "Post"
module.exports = Post;
