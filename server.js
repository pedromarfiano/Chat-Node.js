// CARREGANDO MODULOS
const app = require('express')();
const session = require('express-session');
const { engine } = require('express-handlebars')
var path = require('path');

// const bodyParser = require('body-parser');

const http = require('http').createServer(app);
const router = require('./routers/routers.js');

// var path = require('path');

app.use(session({
    secret: "123123123",
    saveUninitialized: false,
    resave: false
}))

// ENGINE HTML

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// app.set('views', './public/views');
// use.set('views', path.join(__dirname, '/public/views'));


// ROTAS

// retorna as rotas de ./routers/routers.js
app.use('/', router);

router.get('/' , (req , res)=>{
    if(req.session.logado)
        res.redirect('/app/')
        
    res.sendFile(__dirname+'/index.html')
})
router.get('/login', (req, res) => {
    if(req.session.logado){
        res.redirect('/app/')
    }
    if(req.session.erros){
        res.render('login', {erros: req.session.erros})
    } 
    
    res.render('login')
})
router.get('/cadastro', (req, res) => {
    if(req.session.logado){
        res.redirect('/app/')
    }
    if(req.session.erros){
        res.render('cadastro', {erros: req.session.erros})
    } 

    res.render('cadastro')
})
router.get('*' , (req , res)=>{

    res.sendFile(path.join(__dirname, '/views', '/404.html'))
    res.status(404)
    
})

// OPEN SERVER HTTP
http.listen(8081,'10.0.0.104', () =>{
    console.log('Server connect!')
});