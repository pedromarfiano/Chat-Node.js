// const app = require('express')();
const router = require('express').Router()
const bodyParser = require('body-parser');
const db = require('../config/db/Connect');

var path = require('path');


router.use(bodyParser.urlencoded({extended:true}));


// ROTAS DO APP
router.get('/app/' , (req , res)=>{
    if(req.session.logado){
        const admin = req.session.admin;
        // puxa o 1 valor de admin que é um array de objetos
        const row = admin[0]
        // // status se torna online
        // row.users_status = true;

        // usuarios
        db.query("SELECT * FROM tbusers WHERE users_id != ?", [row.users_id], (err, result) => {
            if(err) throw err;
            //console.log(result)
            res.render('app', {admin: row, users: result, title: "Whatzipps"})
        })
        //res.render('app', {admin: row, title: "Whatzipps"})

    } 
    else if(req.cookies.logado){
        db.query("SELECT * FROM tbusers WHERE users_id = ? LIMIT 1", [req.cookies.logado], async (err, result) => {
            if(err) res.redirect('/');

            req.session.admin = await result;
            req.session.logado = 'logado';
            res.redirect('/app/')
        })
    }
    else{
        res.redirect('/');
    }
})
router.get('/app/conversa/:id', (req, res) => {
    if(req.session.logado){
        const admin = req.session.admin;
        // puxa o 1 valor de admin que é um array de objetos
        const row = admin[0]
        // // status se torna online
        // row.users_status = true;

        // usuarios
        db.query("SELECT * FROM tbusers WHERE users_id != ?", [row.users_id], (err, result) => {
            if(err) throw err;
            let result1 = result;
            //console.log(result)
            db.query("SELECT * FROM tbusers WHERE users_id = ?", [req.params.id], (err, result) => {
                if(err) throw err;
                res.render('app', {admin: row, users: result1, title: "Whatzipps", conversa: result[0]})
            })
            
        })

    } 
    else if(req.cookies.logado){
        db.query("SELECT * FROM tbusers WHERE users_id = ? LIMIT 1", [req.cookies.logado], async (err, result) => {
            if(err) res.redirect('/');

            req.session.admin = await result;
            req.session.logado = 'logado';
            res.redirect('/app/')
        })
    }
    else{
        res.redirect('/');
    }
})
router.get('/app/contato/:id', (req, res) => {
    if(req.session.logado){
        const admin = req.session.admin;
        // puxa o 1 valor de admin que é um array de objetos
        const row = admin[0]
        // // status se torna online
        // row.users_status = true;

        // usuarios

        db.query("SELECT * FROM tbusers WHERE users_id = ?", [req.params.id], (err, result) => {
            if(err) throw err;
            res.render('contato', {title: "Whatzipps", contato: result[0]})
        })
            

    } 
    else if(req.cookies.logado){
        db.query("SELECT * FROM tbusers WHERE users_id = ? LIMIT 1", [req.cookies.logado], async (err, result) => {
            if(err) res.redirect('/');

            req.session.admin = await result;
            req.session.logado = 'logado';
            res.redirect('/app/')
        })
    }
    else{
        res.redirect('/');
    }
})
router.get('/app/minha_conta', (req, res) => {
    if(req.session.logado){
        const admin = req.session.admin;
        // puxa o 1 valor de admin que é um array de objetos
        const row = admin[0]
        // mostra no termina o valor do id
        res.render('conta', {admin: row, title: "Whatzipps"})


    }
    else if(req.cookies.logado){
        db.query("SELECT * FROM tbusers WHERE users_id = ? LIMIT 1", [req.cookies.logado], async (err, result) => {
            if(err) res.redirect('/');

            req.session.admin = await result;
            req.session.logado = 'logado';
            res.redirect('/app/minha_conta')
        })
    }
    else{
        res.redirect('/');
    }
})
router.get('/app/usuarios', (req, res) => {
    if(req.session.logado){
        const admin = req.session.admin;
        // puxa o 1 valor de admin que é um array de objetos
        const row = admin[0]
        // mostra no termina o valor do id

        db.query("SELECT * FROM tbusers WHERE users_name LIKE ? OR users_email LIKE ? AND users_id != ?", ["%"+req.query.search+"%" , "%"+req.query.search+"%", row.users_id], (err, result) => {
            if(err) throw err;
            console.log(result)
            res.render('novoUsuario', {admin: row, users: result, title: "Whatzipps"})
        })

        //res.render('novoUsuario', {admin: row, title: "Whatzipps"})
    }
    else if(req.cookies.logado){
        db.query("SELECT * FROM tbusers WHERE users_id = ? LIMIT 1", [req.cookies.logado], async (err, result) => {
            if(err) res.redirect('/');

            req.session.admin = await result;
            req.session.logado = 'logado';
            res.redirect('/app/usuarios')
        })
    }
    else{
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
        // SE EXISTIR UM ERRO ELE SERÁ SALVO EM UMA SESSÃO E ENVIADO PARA SUA PAGINA
        req.session.erros = erros
        res.redirect('/cadastro');
    } else{
        // CONSULTA AO BANCO DE DADOS
        let img = "https://api.dicebear.com/5.x/initials/svg?seed="+req.body.User;

        db.query("INSERT INTO tbusers(users_name, users_email, users_pass, users_img) VALUES(?, ?, ?, ?)",
        [req.body.User, req.body.Email, req.body.Pass, img], async (err, result) => {

            if(err){
                erros.push({texto: 'Ops! Algo deu errado'});
                req.session.erros = erros
                res.redirect('/cadastro');
            }else {

                db.query("SELECT * FROM tbusers WHERE users_email = ? and users_pass = ? LIMIT 1;",
                [req.body.Email, req.body.Pass], async (err, result) => {

                    if(err){
                        erros.push({texto: 'Ops! Algo deu errado'});
                        req.session.erros = erros
                        res.redirect('/cadastro');
                    }
                    else if(result == ''){
                        erros.push({texto: 'Ops! Algo deu errado'});
                        req.session.erros = erros
                        res.redirect('/cadastro');
                    }
                    else {
                        var admin = await result;

                        db.query("UPDATE tbusers SET users_status = ? LIMIT 1;",
                            [admin[0].users_id], (err) => {
                                if(err) res.redirect('/')

                                req.session.admin = admin
                                req.session.logado = 'logado';
                                //res.cookie("logado", admin[0].users_id, {maxAge: 600000, httpOnly: false})
                                res.redirect('/app/')
                            })
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
        // SE EXISTIR UM ERRO ELE SERÁ SALVO EM UMA SESSÃO E ENVIADO PARA SUA PAGINA
        req.session.erros = erros
        res.redirect('/login');
    } else{

        // CONSULTA AO BANCO DE DADOS
        db.query("SELECT * FROM tbusers WHERE users_name = ? and users_pass = ?  or users_email = ? and users_pass = ? LIMIT 1;",
        [req.body.User, req.body.Pass, req.body.User, req.body.Pass], async (err, result) => {

            if(err){
                erros.push({texto: 'Ops! Algo deu errado'});
                req.session.erros = erros
                res.redirect('/login');
            }
            else if(result == ''){
                erros.push({texto: 'Usuario não existe'});
                req.session.erros = erros
                res.redirect('/login');
            }
            else {
                var admin = await result;

                db.query("UPDATE tbusers SET users_status = ? LIMIT 1;",
                    [admin[0].users_id], (err) => {
                        if(err) res.redirect('/')

                        req.session.admin = admin
                        req.session.logado = 'logado';
                        //res.cookie("logado", admin[0].users_id, {maxAge: 600000, httpOnly: false})
                        res.redirect('/app/')
                    })
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
        // SE EXISTIR UM ERRO ELE SERÁ SALVO EM UMA SESSÃO E ENVIADO PARA SUA PAGINA
        req.session.erros = erros
        res.redirect('/app/minha_conta');
    } else{
        db.query("UPDATE tbusers SET users_name = ?, users_email = ?, users_pass = ? WHERE users_id = ? LIMIT 1;",
        [req.body.User, req.body.Email, req.body.Pass, req.params.id], async (err, result) => {

            if(err){
                erros.push({texto: 'Ops! Algo deu errado'});
                req.session.erros = erros
                res.redirect('/app/minha_conta');
            }else {

                db.query("SELECT * FROM tbusers WHERE users_email = ? and users_pass = ? LIMIT 1;",
                [req.body.Email, req.body.Pass], async (err, result) => {

                    if(err){
                        erros.push({texto: 'Ops! Algo deu errado'});
                        req.session.erros = erros
                        res.redirect('/app/minha_conta');
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
            req.session.erros = erros
            res.redirect('/app/minha_conta');
        }else {
            req.session.destroy(null);
            res.clearCookie("logado");
            res.redirect('/');
        }
    })
})


router.post('/sair', (req, res) => {
    if (req.session.logado  || res.cookie.logado) {
        req.session.destroy(null);
        res.clearCookie("logado");
        res.redirect('/login');
    }else{
        res.redirect('/');
    }
})

module.exports  = router