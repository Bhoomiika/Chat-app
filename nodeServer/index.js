//Node server which will handle socket.io connections
console.log("working");
const io = require('socket.io')(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', uname => {

        users[socket.id] = uname;
        socket.broadcast.emit('user-joined', uname);
        //console.log("New user", uname);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, uname: users[socket.id] });
    });

    // socket.on('disconnect', uname => {
    //     socket.broadcast.emit('left', users[socket.id], uname);
    //     delete users[socket.id];
    // });

    // Server-side code
    socket.on('disconnect', () => {
        const leftUsername = users[socket.id]; // Get the username of the disconnected user
        delete users[socket.id]; // Remove the user from the users object
        io.emit('left', leftUsername); // Emit the 'left' event with the username
    });

})