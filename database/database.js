const Sequelize = require("sequelize")
//cria a conexão com o banco de dados usando o new Sequelize('nome do banco', 'usuario', 'senha')
const connection = new Sequelize('deblog', 'root', 'guitarra21', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: "-3:00"
})

module.exports = connection;