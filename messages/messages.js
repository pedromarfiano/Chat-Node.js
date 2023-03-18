const express = require('express');
const { Server } = require('socket.io');
const { router, db } = require('../routers/routers.js');

const app = express();
const http = require('http').createServer(app);
const io = new Server(http);

//SERVIDOR WS
io.on("connection", (socket) => {

    // AO CONECTAR
    console.log(`novo socket ${socket.id}`);
    
    socket.emit('dados', 
        email = 'ana@gmail.com'
    )
    // MANDA PRO FRONTEND QUE UM SOCKET FOI CONECTADO
    socket.broadcast.emit('socketEmit', `socket ${socket.id} conectado`);

    socket.on('msg', (msg, email) =>{
        console.log(`email: ${email}, mensagem: ${msg}`)

        socket.emit('msgServer', msg);
        socket.broadcast.emit('msgServer', msg);
    })

    // AO SAIR
    socket.on('disconnect', () => {
        socket.emit('socketEmit', `socket desconectado ${socket.id}`)
    })
});

//ROTAS DE BATE-PAPO
router.get('/app/conversa/:id', (req, res) => {
    if(req.session.logado){
        const admin = req.session.admin;
        const row = admin[0]

        db.query("SELECT * FROM tbusers WHERE users_id != ?", [row.users_id], (err, result) => {
            if(err) throw err;
            let result1 = result;
            
            db.query("SELECT * FROM tbusers WHERE users_id = ?", [req.params.id], (err, result) => {
                if(err) throw err;
                let result2 = result;

                db.query("SELECT * FROM tbmessages WHERE msg_remetente_id = ? AND msg_destinatario_id = ? OR msg_remetente_id = ? AND msg_destinatario_id = ? ORDER BY msg_id", [row.users_id, req.params.id, req.params.id, row.users_id], (err, result) => {
                    if(err) throw err;

                    res.render('app', {admin: row, users: result1, title: "Whatzipps", conversa: result2[0], message: result})
                })
            })
            
        })

    } 
    else if(req.cookies.logado){
        db.query("SELECT * FROM tbusers WHERE users_id = ? LIMIT 1", [req.cookies.logado], async (err, result) => {
            if(err) res.redirect('/');

            req.session.admin = await result;
            req.session.logado = 'logado';
            res.redirect('/app/')
        })
    }
    else{
        res.redirect('/');
    }
})


module.exports = {http, express, app, io, router}