// CARREGANDO MODULOS
// const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars')
const cookieparser = require('cookie-parser');
const path = require('path');
// const db = require('config/db/Connect');
const { http, express, app, io, router} = require('./messages/messages.js')

// const app = express();
// const http = require('http').createServer(app);
// const io = new Server(http);

app.use(session({
    secret: "123123123",
    saveUninitialized: false,
    resave: false
}))

// ENGINE HTML

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.use(express.static('./public'))

// COOKIES
app.use(cookieparser());

// ROTAS

// retorna as rotas de ./routers/routers.js
app.use('/', router);

router.get('/' , (req , res)=>{
    if(req.session.logado || req.cookies.logado)
        res.redirect('/app/')
    
    else   
        res.render('index');
})

router.get('/login', (req, res) => {
    if(req.session.logado || req.cookies.logado)
        res.redirect('/app/')

    if(req.session.erros){
        res.render('login', {erros: req.session.erros, title: "Login"})
    } 
    
    res.render('login')
})
router.get('/cadastro', (req, res) => {
    if(req.session.logado || req.cookies.logado)
        res.redirect('/app/')

    if(req.session.erros){
        res.render('cadastro', {erros: req.session.erros, title: "Cadastro"})
    } 

    res.render('cadastro')
})
router.get('*' , (req , res)=>{
    if(req.session.logado || req.cookies.logado)
        res.redirect('/app/')

    res.render('404', {title: "404"});
    res.status(404)
    
})

// OPEN SERVER HTTP
http.listen(8081, () =>{
    console.log('Server connect!')
});
