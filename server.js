// CARREGANDO MODULOS
const express = require('express')
const session = require('express-session');
const { engine } = require('express-handlebars')
const cookieparser = require('cookie-parser');
const path = require('path');
const router = require('./routers/routers.js');
// const db = require('config/db/Connect');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

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


// SERVIDOR WS
io.on("connection", (socket) => {
    console.log(`novo socket ${socket.id}`); // ojIckSD2jqNzOqIrAGzL
    socket.broadcast.emit('socketConnected', `socket ${socket.id} conectado`);

    socket.on('msg', (msg) =>{
        //console.log(msg)
        socket.emit('msgServer', msg);
        socket.broadcast.emit('msgServer', msg);
    })
});

// ROTAS

// retorna as rotas de ./routers/routers.js
app.use('/', router);

router.get('/' , (req , res)=>{
    if(req.session.logado || req.cookies.logado)
        res.redirect('/app/')
    
    else   
        res.sendFile(__dirname + "/index.html")
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

    res.sendFile(path.join(__dirname, '/views', '/404.html'))
    res.status(404)
    
})

// OPEN SERVER HTTP
http.listen(8081,'192.168.8.86' , () =>{
    console.log('Server connect!')
});