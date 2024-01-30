const express = require("express")
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify")

router.get("/categories", (req, res) => {
    res.send("rota de categorias")
})

router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new")
})

router.post("/categories/save", (req, res) => {
   //seta a variável title com o título fornecido pelo criado
   //utiliza o Body-Parser para fazer essa conversão
   //se a variável não for undefined, cria uma nova label no tabela "Category"
   //utiliza o Slugify para transformar o titulo em slug
    var title = req.body.title
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories")
        })

    }else{
        res.redirect("/admin/categories/new")
    }
})


//rota criada para mostrar as categorias presentes no bd
//Category é a constante usada para linkar com a tabela categories do bd
// .findAll vai me retornar todas as linhas dessa tabela
// .then vai ser executado dps
// pega categories como parâmetro para passar todas as ocorrencias
//{categories:categories} para enviar via JSON os dados para o frontend
router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("./admin/categories/index", {categories: categories})
    })
})


//category é a constante que linka com a tabela categories
//destroy vai deletar a linha cujo id seja igual ao recebido pelo body-parser
router.post("/categories/delete", (req, res) => {
    var id = req.body.id
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        }else {
            res.redirect("/admin/categories")
        }
    }else {
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/categories")
    }
    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render("admin/categories/edit", {category:category})
        }else {
            res.redirect("/admin/categories")
        }
    }).catch(erro => {
        res.redirect("/admin/categories")
    })
})

router.post("/categories/update", (req,res) => {
    var id = req.body.id
    var title = req.body.title

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id : id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})

module.exports = router