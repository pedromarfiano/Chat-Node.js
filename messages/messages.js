const express = require('express');
const { Server } = require('socket.io');
const { router, db } = require('../routers/routers.js');
const app = express();
const http = require('http').createServer(app);
const io = new Server(http);

let clientSocketIds = [];
let connectedUsers= [];

var userID;

function getID(id) {
    userID = id
    console.log(userID);
    io.on('connection', (socket) => {
        socket.emit('dados', 
            emitID = userID,
            id_socket = socket.id
        )
        // socket.emit('uploadList', 
        //     {}
        // )
    })
}

const getSocketByUserId = (userId) =>{
    let socket = '';
    for(let i = 0; i<clientSocketIds.length; i++) {
        if(clientSocketIds[i].userId == userId) {
            socket = clientSocketIds[i].socket;
            break;
        }
    }
    return socket;
}

//SERVIDOR WS
io.on("connection", (socket) => {


    socket.on('disconnect', () => {
        console.log(`Disconnected ${socket.id}`);
        socket.emit('socketEmit', `socket desconectado ${socket.id}`)
        //console.log(`socket desconectado ${socket.id}`);

        connectedUsers = connectedUsers.filter(item => item.socketId != socket.id);
        io.emit('updateUserList', connectedUsers)
    })

    // AO CONECTAR
    console.log(`Connected ${socket.id}`);
    socket.broadcast.emit('socketEmit', `socket ${socket.id} conectado`);
    

    // MSG

    socket.on('loggedin', function(user) {
        db.query("SELECT * FROM tbusers WHERE users_id = ?", [user.user], (err, result) => {
            if (err) throw err;

            socket.emit('UploadListOnline', result[0], user.socket);
        })
        // clientSocketIds.push({socket: socket, userId:  user.user_id});
        // connectedUsers = connectedUsers.filter(item => item.user_id != user.user_id);
        // connectedUsers.push({...user, socketId: socket.id})
        // io.emit('updateUserList', connectedUsers)
    });

    socket.on('GetMsg', (destinatario, remetente) => {
        db.query("SELECT * FROM tbmessages WHERE msg_remetente_id = ? AND msg_destinatario_id = ? OR msg_remetente_id = ? AND msg_destinatario_id = ? ORDER BY msg_id", [remetente, destinatario, remetente, destinatario], (err, result) => {
            if (err) throw err;

            socket.emit('UploadListMessage', result);
        })
    })

    socket.on('create', function(data) {
        console.log("create room")
        socket.join(data.room);
        let withSocket = getSocketByUserId(data.withUserId);
        socket.broadcast.to(withSocket.id).emit("invite",{room:data})
    });
    socket.on('joinRoom', function(data) {
        socket.join(data.room.room);
    });

    socket.on('message', function(data) {
        socket.broadcast.to(data.room).emit('message', data);
    })

    // socket.on('msg', (msg, id) =>{
    //     console.log(`email: ${id}, mensagem: ${msg}`)

    //     socket.emit('msgServer', msg, id);
    //     socket.broadcast.emit('msgServer', msg, id);

    // })


});

//ROTAS DE BATE-PAPO
router.get('/app/conversa/:id', (req, res) => {
    if(req.session.logado){
        const admin = req.session.admin;
        const row = admin[0]

        getID(row.users_id);

        // io.on("connection", (socket) => {

        //     socket.emit('dados', 
        //         id = row.users_id,
        //         id_socket = socket.userID
        //     )
        //     socket.on('msg', (msg, id) =>{


        //         db.query("INSERT INTO tbmessages(msg_remetente_id, msg_destinatario_id, msg) VALUES(?, ?, ?)", [row.users_id, req.params.id, msg], (err, result) =>{
        //             if(err) throw err;
                    

        //         })
        
        //     })
        // })

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