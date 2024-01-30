const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const usersControler = require("./users/usersControler")
const User = require("./users/User")
const session = require("express-session")



//view engine
app.set('view engine', 'ejs')

// sessions
app.use(session({
    secret: "cryptmypass", cookie: {maxAge: 300000}
}))

//static
app.use(express.static('public'))

//body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//conexão com o banco de dados
//.authenticate - tenta logar com os dados fornecidos no arquivo de conexão da database
connection
    .authenticate()
    .then(() => {
        console.log("banco de dados OK!")
    }).catch((error) => {
        console.log(error);
    })

app.get("/", (req, res) => {

    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories})
        })

        
    })

})

// "/" é a definição do prefixo da rota, é feito "prefixo" + "rota"
app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", usersControler)




app.get("/:slug", (req,res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(error => {
        res.redirect("/")
    })
})

//include utiliza o sequelize para buscar todos os artigos relacionados com a categoria no BD

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            })

        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.listen(8080, () => {
    console.log("o servidor está rodando!")
})