const { randomInt, randomUUID } = require('crypto');
const express = require('express');
const { Server } = require('socket.io');
const { router, db } = require('../routers/routers.js');

const app = express();
const http = require('http').createServer(app);
const io = new Server(http);

function atualizar() {
    // db.query("SELECT * FROM tbusers WHERE users_id != ?", [], (err, result) => {
    //     if(err) throw err;
        
    // });
    
}
let socketUsersID = [];
let UsersID = [];
//SERVIDOR WS
io.on("connection", (socket) => {
   
    console.log(`Connected ${socket.id}`);
    // AO CONECTAR
    socketUsersID.push(socket.id);
    socket.emit('atualizarSockets',
        socketUsersID
    )
    socket.broadcast.emit('socketEmit', `socket ${socket.id} conectado`);
    console.log(`novo socket ${socket.id}`);
    
    // socket.join(socket.id);

    socket.on('msg', (msg, id) =>{
        console.log(`email: ${id}, mensagem: ${msg}`)
        socket.broadcast.emit('msgServer', msg, id);
        socket.emit('msgServer', msg, id);

    })

    socket.on('disconnect', () => {
        console.log(`Disconnected ${socket.id}`)
        socketUsersID = socketUsersID.filter(item => item != socket.id);
        socket.emit('atualizarSockets', 
            socketUsersID,
            console.log(socketUsersID)
        )

        socket.emit('socketEmit', `socket desconectado ${socket.id}`)
        console.log(`socket desconectado ${socket.id}`);
    })

});

//ROTAS DE BATE-PAPO
router.get('/app/conversa/:id', (req, res) => {
    if(req.session.logado){
        const admin = req.session.admin;
        const row = admin[0]

        io.on("connection", (socket) => {

            //console.log(`Connected ${socket.id}`);

            socket.userID = row.users_id;

            //socket.join(socket.id);

            socket.emit('dados', 
                id = row.users_id,
                id_socket = socket.userID
            )
            socket.on('msg', (msg, id) =>{

                //console.log(`email: ${id}, mensagem: ${msg}`)

                //console.log(req.params.id)

                db.query("INSERT INTO tbmessages(msg_remetente_id, msg_destinatario_id, msg) VALUES(?, ?, ?)", [row.users_id, req.params.id, msg], (err, result) =>{
                    if(err) throw err;
                    

                })
        
            })
        })

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