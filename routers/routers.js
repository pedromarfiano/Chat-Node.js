// const app = require('express')();
const router = require('express').Router()
const bodyParser = require('body-parser');
const db = require('../db/Connect');

var path = require('path');

router.use(bodyParser.urlencoded({extended:true}));


// ROTAS DO APP
router.get('/app/' , (req , res)=>{
    if(req.session.logado){
        res.sendFile(path.join(__dirname, '../public', 'views/app.html'))
    } else{
        res.redirect('/');
    }
})
router.get('/app/minha_conta', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', '/views/conta.html'))
})


// ROTAS DO BANCO DE DADOS

router.post('/cadastar', (req,res) => {
    let img = "https://api.dicebear.com/5.x/initials/svg?seed="+req.body.User;
    db.query("INSERT INTO tbusers(users_name, users_email, users_pass, users_img) VALUES(?, ?, ?, ?)",
    [req.body.User, req.body.Email, req.body.Pass, img], (err, result) => {

        if(err) throw err;
        console.log(JSON.stringify(result));
    })
    // db.inserir('ana', 'ana@gmail.com', '123');
    res.redirect('/app/')
})


router.post('/logar', (req, res) => {
    //var query = []
    db.query("SELECT * FROM tbusers WHERE users_name = ? or users_email = ? and users_pass = ? LIMIT 1;",
    [req.body.User, req.body.User, req.body.Pass], async (err, result) => {

        if(err) throw err;
        req.session.admin = await result;
        // res.send(req.session.admin);
        req.session.logado = 'logado';
        await res.redirect('/app/')
    })
})


router.put('/alterar/:id', (req, res) => {
    // db.alterar('ana', 'ana@gmail.com', '123', req.params.id);
    res.redirect('/app/minha_conta')
})


router.delete('/deletar/:id', (req, res) => {
    // db.deletar(req.params.id)
    res.redirect('/')
})


router.post('/sair', (req, res) => {
    // If the user is loggedin
    if (req.session.conectado) {
        req.session.conectado = false;
        res.redirect('/login');
    }else{
        // Not logged in
        res.redirect('/');
    }
})

module.exports  = router