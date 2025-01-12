const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User'); // Certifique-se de que este caminho está correto
const Post = require('./Post'); // Certifique-se de que este caminho está correto

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    postId: { // Relaciona o comentário a um post
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    userId: { // Relaciona o comentário a um usuário
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'comments',
    timestamps: true,
});

// Relacionamentos
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' }); // Um comentário pertence a um usuário
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' }); // Um comentário pertence a um post

module.exports = Comment;
