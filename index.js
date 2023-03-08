// Node server which will handle socket io connection

const dotenv = require('dotenv');

dotenv.config({path: './config.env'})

const io = require('socket.io')((process.env.PORT || 8000), {
    cors: {
        origin: [process.env.CLIENT_URL]
        // origin: ['http://127.0.0.1:5500/client/dist/index.html']
    }
})
console.log('fired');

const users = {};
var arr = new Array();

io.on('connection', socket => { // Listen incoming events by instances
    socket.on('new-user-joined', name => {
        console.log("new user", name)
        users[socket.id] = name;
        for (let index = 0; index < users.length; index++) {
            arr[index] =users[socket.id];
            
        }
        socket.broadcast.emit('user-joined', name, arr);
    })
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id]});
    })
    socket.on('disconnect', message => {
        const index = arr.indexOf(users[socket.id]);
        if (index > -1) { // only splice array when item is found
            arr.splice(index, 1); // 2nd parameter means remove one item only
        }
        socket.broadcast.emit('left', users[socket.id], arr);
        delete users[socket.id];
    })
})
