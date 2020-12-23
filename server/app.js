const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors")
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const User = require("./models/User")
const app = express();
app.use(cors())

app.use(index);

const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost/sock";
console.log("Connecting DB to ", MONGODB_URI);


mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((x) =>
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    )
    .catch((err) => console.error("Error connecting to mongo", err));


let interval;

io.on('connection', function (socket) {
    // Connection now authenticated to receive further events
    console.log('connection made')
    if (socket.handshake.query && socket.handshake.query.token) {
        console.log('hey!')
        jwt.verify(socket.handshake.query.token, 'secretkey', function (err, data) {
            if (err) {
                console.log(err.message)
                socket.emit('error', { error: err.message })
                return new Error('Authentication error');
            }
            console.log('in here ', data)
            socket.emit('user', { user: data.user, token: socket.handshake.query.token })
        })
    }

    socket.on('message', function (message) {
        io.emit('message', message);
    });
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });



    socket.on('signUp', (data) => {
        console.log('signUp', data)
        User.register(data, data.password)
            .then((user) => {
                jwt.sign({ user }, "secretkey", { expiresIn: "7d" }, (err, token) => {
                    socket.emit('user', { user, token })
                });
            })
            .catch((error) => {
                console.log(error);
                socket.emit('error', { error })
            });
    })
    socket.on('logIn', (user) => {
        console.log('logIn', user)
        jwt.sign({ user }, "secretkey", { expiresIn: "7d" }, (err, token) => {
            socket.emit('user', { user, token })
        })
    })
    socket.on('logOut', (data) => {
        console.log('logOut', data)
    })
    socket.on('getUser', (data) => {
        console.log('getUsr', data)
    })
});


// });

const getApiAndEmit = socket => {
    const response = new Date();
    // console.log('emit', response)
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
    //io.emit("FromAPI", response); Broadcast to all https://socket.io/docs/v3/emit-cheatsheet/
}

// let interval;


// io.on("connection", (socket) => {
//     console.log("New client connected", socket.id);
//     if (interval) {
//         clearInterval(interval);
//     }
//     interval = setInterval(() => getApiAndEmit(socket), 1000);
//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//         clearInterval(interval);
//     });



//     socket.on('peanuts', (data) => {
//         console.log('peanuts', data)
//     })
// });

// const getApiAndEmit = socket => {
//     const response = new Date();
//     console.log('emit', response)
//     // Emitting a new message. Will be consumed by the client
//     socket.emit("FromAPI", response);
//     //io.emit("FromAPI", response); Broadcast to all https://socket.io/docs/v3/emit-cheatsheet/

// };



server.listen(port, () => console.log(`Listening on port ${port}`));