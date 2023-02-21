const app = require('express')();
const router = require('express').Router()
const session = require('express-session');

const bodyParser = require('body-parser');
const con = require('../db/Connect');

app.use(session({secret: "1234567890"}))

const db = new con();

var path = require('path');

app.use(bodyParser.urlencoded({extended:true}));


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
// router.get('/app/conversas', (req, res) => {
    
// })

// ROTAS DO BANCO DE DADOS

router.post('/cadastar', (req,res) => {
    db.inserir('ana', 'ana@gmail.com', '123');
    res.redirect('/app/')
})
router.post('/logar', (req, res) => {
    //var query = []
    db.logar('pedro', '123');
    req.session.logado = 'logado';
    res.redirect('/app/')
})
router.put('/alterar/:id', (req, res) => {
    db.alterar('ana', 'ana@gmail.com', '123', req.params.id);
    res.redirect('/app/minha_conta')
})
router.delete('/deletar/:id', (req, res) => {
    db.deletar(req.params.id)
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