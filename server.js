// CARREGANDO MODULOS
const app = require('express')();
const session = require('express-session');

const bodyParser = require('body-parser');

const http = require('http').createServer(app);
const router = require('./routers/routers.js');

// var path = require('path');

app.use(session({secret: "1234567890"}))
app.use(bodyParser.urlencoded({extended:true}));

// ENGINE HTML

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// use.set('views', path.join(__dirname, '/public/views'));


// ROTAS

// retorna as rotas de ./routers/routers.js
app.use('/', router);

router.get('/' , (req , res)=>{
    res.sendFile(__dirname+'/index.html')
})
router.get('/login', (req, res) => {
    res.sendFile(__dirname+'/public/views/login.html')
})
router.get('/cadastro', (req, res) => {
    res.sendFile(__dirname+'/public/views/cadastro.html')
})

// OPEN SERVER HTTP
http.listen(8081, () =>{
    console.log('Server connect!')
});