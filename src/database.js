const { Sequelize } = require('sequelize');

// Carrega variáveis de ambiente
require('dotenv').config();

// Cria a instância do Sequelize
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Necessário se o banco usa SSL
        },
    },
});

module.exports = sequelize;
