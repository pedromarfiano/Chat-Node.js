const router = require('express').Router()
const con = require('../db/Connect');

const db = new con();

var path = require('path');

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

router.post('/cadastar', (req,res) => {
    db.inserir();
})
router.post('/logar', (req, res) => {

})
router.put('/alterar', (req, res) => {

})
router.get('/sair/:id', (req, res) => {

})
router.delete('/deletar', (req, res) => {

})

module.exports  = router