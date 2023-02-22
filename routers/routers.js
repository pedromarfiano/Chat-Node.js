// const app = require('express')();
const router = require('express').Router()
const bodyParser = require('body-parser');
const db = require('../db/Connect');

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

        // res.sendFile(path.join(__dirname, '../public', 'views/app.html'))

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

        // res.sendFile(path.join(__dirname, '../public', 'views/app.html'))

    } else{
        res.redirect('/');
    }

    // res.sendFile(path.join(__dirname+'./views/conta.html'))
})


// ROTAS DO BANCO DE DADOS

router.post('/cadastrar', (req,res) => {
    let img = "https://api.dicebear.com/5.x/initials/svg?seed="+req.body.User;
    db.query("INSERT INTO tbusers(users_name, users_email, users_pass, users_img) VALUES(?, ?, ?, ?)",
    [req.body.User, req.body.Email, req.body.Pass, img], async (err, result) => {

        if(err) throw err;

        db.query("SELECT * FROM tbusers WHERE users_email = ? and users_pass = ? LIMIT 1;",
        [req.body.Email, req.body.Pass], async (err, result) => {

        if(err) throw err;
        req.session.admin = await result;
        req.session.logado = 'logado';
        await res.redirect('/app/')
    })
    })
})


router.post('/logar', (req, res) => {
    //var query = []
    db.query("SELECT * FROM tbusers WHERE users_name = ? or users_email = ? and users_pass = ? LIMIT 1;",
    [req.body.User, req.body.User, req.body.Pass], async (err, result) => {

        if(err) throw err;
        req.session.admin = await result;
        req.session.logado = 'logado';
        await res.redirect('/app/')
    })
})


router.post('/alterar/:id', (req, res) => {
    db.query("UPDATE tbusers SET users_name = ?, users_email = ?, users_pass = ? WHERE users_id = ? LIMIT 1;",
    [req.body.User, req.body.Email, req.body.Pass, req.params.id], async (err, result) => {

        if(err) throw err;

        db.query("SELECT * FROM tbusers WHERE users_email = ? and users_pass = ? LIMIT 1;",
        [req.body.Email, req.body.Pass], async (err, result) => {

            if(err) throw err;
            req.session.admin = await result;
            await res.redirect('/app/minha_conta')
        })
    })
})


router.post('/deletar/:id', (req, res) => {
    db.query("DELETE FROM tbusers WHERE users_id = ?",
    [req.params.id], (err, result) => {
        if(err) throw err;

        req.session.destroy(null);
        // res.clearCookie(this.cookie, { path: '/' });
        res.redirect('/');
    })
})


router.post('/sair', (req, res) => {
    // If the user is loggedin
    if (req.session.logado) {
        req.session.destroy(null);
        res.redirect('/login');
    }else{
        // Not logged in
        res.redirect('/');
    }
})

module.exports  = router