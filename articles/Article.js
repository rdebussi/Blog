const Sequelize = require("sequelize")
const connection = require("../database/database")
const Category = require("../categories/Category")

//importa o sequeliza para transformar JS em SQL
//importa a conexão com o banco de dados "connection"
//SLUG = usa o nome do tittle como rota
//connection.define = define os parametros e cria a tabela no BD
const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }, body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
}) 

Category.hasMany(Article) //cria um relacionamento 1:n
Article.belongsTo(Category) //cria um relacionamento 1:1

//Article.sync({force : true})

module.exports = Article