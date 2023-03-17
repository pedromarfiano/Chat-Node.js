const { Server } = require('socket.io');
const io = new Server(8081);

// SERVIDOR WS
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

export default io