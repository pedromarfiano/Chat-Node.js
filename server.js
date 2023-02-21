// CARREGANDO MODULOS
const app = require('express')();
const session = require('express-session');

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

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
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
    if(req.session.logado)
        res.redirect('/app/')
    
    res.sendFile(__dirname+'/public/views/login.html')
})
router.get('/cadastro', (req, res) => {
    if(req.session.logado)
        res.redirect('/app/')

    res.sendFile(__dirname+'/public/views/cadastro.html')
})
router.get('*' , (req , res)=>{
    res.send('ERRO 404')
})

// OPEN SERVER HTTP
http.listen(8081, () =>{
    console.log('Server connect!')
});