const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Certifique-se de ajustar o caminho se necessário

// Definição do modelo "Post"
const Post = sequelize.define(
    'Post', // Nome do modelo
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
        tableName: 'posts', // Nome da tabela no banco de dados
        timestamps: false,  // Desativa as colunas automáticas createdAt e updatedAt
    }
);

module.exports = Post;
