const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Post = sequelize.define('Post', {
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
    userId: { // Faz referência ao campo 'id' na tabela 'users'
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Nome do modelo associado
            key: 'id', // Campo de referência
        },
        onDelete: 'CASCADE',
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'posts',
    timestamps: true,
});

// Relacionamento
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Post;
