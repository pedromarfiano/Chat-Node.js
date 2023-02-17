const app = require('express')();
const router = require('express').Router()
const bodyParser = require('body-parser');
const con = require('../db/Connect');


const db = new con();


var path = require('path');

app.use(bodyParser.urlencoded({extended:true}));


// ROTAS DO APP
router.get('/app/' , (req , res)=>{
    res.sendFile(path.join(__dirname, '../public', 'views/app.html'))
})
router.get('/app/minha_conta', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', '/views/conta.html'))
})
// router.get('/app/conversas', (req, res) => {
    
// })

// ROTAS DO BANCO DE DADOS

router.get('/cadastar', (req,res) => {
    db.inserir('ana', 'ana@gmail.com', '123');
    //res.redirect('/')
})
router.get('/logar', (req, res) => {
    db.logar('pedro', '123');
    //res.redirect('/')
})
router.put('/alterar', (req, res) => {

})
router.get('/sair/:id', (req, res) => {

})
router.delete('/deletar', (req, res) => {

})

module.exports  = router