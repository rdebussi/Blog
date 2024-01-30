const Sequelize = require("sequelize")
const connection = require("../database/database")

//importa o sequeliza para transformar JS em SQL
//importa a conexão com o banco de dados "connection"
//SLUG = usa o nome do tittle como rota
//connection.define = define os parametros e cria a tabela no BD
const Category = connection.define('categories',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//usa somente na primeira, se não ele fica tentando criar a tabela sempre
//Category.sync({force : true})

module.exports = Category