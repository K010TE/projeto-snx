const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Comment = sequelize.define(
    'Comment',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
    },
    {
        tableName: 'comments',
        timestamps: true, // createdAt e updatedAt serão gerenciados automaticamente
    }
);

module.exports = Comment;
