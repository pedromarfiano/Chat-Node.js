// const app = require('express')();
const router = require('express').Router()
const bodyParser = require('body-parser');
const db = require('../config/db/Connect');

var path = require('path');

router.use(bodyParser.urlencoded({extended:true}));

// CONFIGURANDO ENDINE HANDLEBARS

// ROTAS DO APP
router.get('/app/' , (req , res)=>{
    if(req.session.logado){
        const admin = req.session.admin;
        // puxa o 1 valor de admin que é um array de objetos
        const row = admin[0]
        // mostra no termina o valor do id
        res.render('app', {admin: row})

    } else{
        res.redirect('/');
    }
})
router.get('/app/minha_conta', (req, res) => {
    if(req.session.logado){
        const admin = req.session.admin;
        // puxa o 1 valor de admin que é um array de objetos
        const row = admin[0]
        // mostra no termina o valor do id
        res.render('conta', {admin: row})


    } else{
        res.redirect('/');
    }
})


// ROTAS DO BANCO DE DADOS

router.post('/cadastrar', (req,res) => {
    
    // VALIDANDO FORMULÁRIO
    var erros = []
    if(req.body.User == null || req.body.User == '' || typeof req.body.User == undefined || req.body.User.length <2){
        erros.push({texto: 'usuario invalido'})
    }
    if(req.body.Email == null || req.body.Email == '' || typeof req.body.Email == undefined || req.body.Email.length <10){
        erros.push({texto: 'email invalido'})
    }
    if(req.body.Pass == null || req.body.Pass == '' || typeof req.body.Pass == undefined || req.body.Pass.length <5){
        erros.push({texto: 'senha invalida'})
    }
    if(req.body.Pass != req.body.Cpass){
        erros.push({texto: 'confirme sua senha'})
    }
    if(erros.length != 0){
        res.render('cadastro', {erros: erros})
    } else{
        // CONSULTA AO BANCO DE DADOS
        let img = "https://api.dicebear.com/5.x/initials/svg?seed="+req.body.User;

        db.query("INSERT INTO tbusers(users_name, users_email, users_pass, users_img) VALUES(?, ?, ?, ?)",
        [req.body.User, req.body.Email, req.body.Pass, img], async (err, result) => {

            if(err){
                erros.push({texto: 'Ops! Algo deu errado'});
                res.render('cadastro', {erros: erros})
            }else {

                db.query("SELECT * FROM tbusers WHERE users_email = ? and users_pass = ? LIMIT 1;",
                [req.body.Email, req.body.Pass], async (err, result) => {

                    if(err){
                        erros.push({texto: 'Ops! Algo deu errado'});
                        res.render('cadastro', {erros: erros})
                    }else {
                        req.session.admin = await result;
                        req.session.logado = 'logado';
                        await res.redirect('/app/')
                    }
                })
            }
        })
    }

    
})


router.post('/logar', (req, res) => {

    // VALIDANDO FORMULÁRIO
    var erros = []
    if(req.body.User == null || req.body.User == '' || typeof req.body.User == undefined || req.body.User.length <2){
        erros.push({texto: 'usuario invalido'})
    }
    if(req.body.Pass == null || req.body.Pass == '' || typeof req.body.Pass == undefined || req.body.Pass.length <5){
        erros.push({texto: 'senha invalida'})
    }
    if(erros.length != 0){
        res.render('login', {erros: erros})
    } else{

        // CONSULTA AO BANCO DE DADOS
        db.query("SELECT * FROM tbusers WHERE users_name = ? or users_email = ? and users_pass = ? LIMIT 1;",
        [req.body.User, req.body.User, req.body.Pass], async (err, result) => {

            if(err){
                erros.push({texto: 'Ops! Algo deu errado'});
                res.render('login', {erros: erros})
            }else {
                req.session.admin = await result;
                req.session.logado = 'logado';
                await res.redirect('/app/')
            }
            
        })
    }
    
})


router.post('/alterar/:id', (req, res) => {
    var erros = []

    if(req.body.User == null || req.body.User == '' || typeof req.body.User == undefined || req.body.User.length <2){
        erros.push({texto: 'usuario invalido'})
    }
    if(req.body.Email == null || req.body.Email == '' || typeof req.body.Email == undefined || req.body.Email.length <10){
        erros.push({texto: 'email invalido'})
    }
    if(req.body.Pass == null || req.body.Pass == '' || typeof req.body.Pass == undefined || req.body.Pass.length <5){
        erros.push({texto: 'senha invalida'})
    }
    if(erros.length != 0){
        res.render('conta', {erros: erros})
    } else{
        db.query("UPDATE tbusers SET users_name = ?, users_email = ?, users_pass = ? WHERE users_id = ? LIMIT 1;",
        [req.body.User, req.body.Email, req.body.Pass, req.params.id], async (err, result) => {

            if(err){
                erros.push({texto: 'Ops! Algo deu errado'});
                res.render('conta', {erros: erros})
            }else {

                db.query("SELECT * FROM tbusers WHERE users_email = ? and users_pass = ? LIMIT 1;",
                [req.body.Email, req.body.Pass], async (err, result) => {

                    if(err){
                        erros.push({texto: 'Ops! Algo deu errado'});
                        res.render('conta', {erros: erros})
                    }else {
                        req.session.admin = await result;
                        await res.redirect('/app/minha_conta')
                    }
                })
            }
        })
    }
})


router.post('/deletar/:id', (req, res) => {
    var erros = []

    db.query("DELETE FROM tbusers WHERE users_id = ? LIMIT 1",
    [req.params.id], (err, result) => {
        if(err){
            erros.push({texto: 'Ops! Algo deu errado'});
            res.render('conta', {erros: erros})
        }else {
            req.session.destroy(null);
            // res.clearCookie(this.cookie, { path: '/' });
            res.redirect('/');
        }
    })
})


router.post('/sair', (req, res) => {
    if (req.session.logado) {
        req.session.destroy(null);
        // res.clearCookie(this.cookie, { path: '/' });
        res.redirect('/login');
    }else{
        res.redirect('/');
    }
})

module.exports  = router