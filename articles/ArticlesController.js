const express = require("express")
const router = express.Router()
//importa o express e o cria o modo Router do Express
//router é uma ferramenta do EXPRESS para criar rotas fora do index.js
//utiliza o router.get e linka no index como "app.use("/", articleController)
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")


//lembrar de passsar o articles para o back a view {articles : articles}
//inclui o model Category, passando via JSON como objeto
//na busca de arquivos ele vai incluir os dados tipo category
router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{model : Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })
})

router.get("/admin/articles/new", adminAuth , (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories:categories})
    })
})

router.post("/articles/save", adminAuth ,(req, res) => {
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

//category é a constante que linka com a tabela categories
//destroy vai deletar a linha cujo id seja igual ao recebido pelo body-parser
router.post("/articles/delete", adminAuth, (req, res) => {
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else {
            res.redirect("/admin/articles")
        }
    }else {
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id
    if(isNaN(id)){
        res.redirect("admin/articles")
    }
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
               res.render("admin/articles/edit", {article: article, categories: categories})
            })
        }else{
            res.redirect("admin/articles")
        }
    }).catch(err => {
        res.redirect("admin/articles")
    })
})


router.post("/article/update", adminAuth, (req, res) => {
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category
    Article.update({body: body, title: title, categoryId: category, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/articles")
    })

})


router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num
    var offset = 0;9
    if(isNaN(page) || page == 1){
        offset = 0;
    } else {
        offset = (parseInt(page)-1)*4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', 'DESC']]
    }).then(articles => {

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        } else {
            next = true
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })

    })
})

module.exports = router