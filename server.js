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

// app.get('/', (req, res) => {
//     res.sendFile(__dirname+'/index.html');
// })

app.use('/app', router);

// OPEN SERVER HTTP
http.listen(8081, () =>{
    console.log('Server connect!')
});