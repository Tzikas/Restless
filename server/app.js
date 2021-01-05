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

//Allows socket to be combined with routes
app.set("socketIo", io);


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/restless";

console.log("Connecting DB to ", MONGODB_URI);

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((x) =>
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    )
    .catch((err) => console.error("Error connecting to mongo", err));



const users = {

}


// meow. im huuungry. meow.

io.on('connection', function (socket) {
    console.log('Client connected: ', socket.id)

    let newUser = { socketId: socket.id }

    io.sockets.emit('new-connection', newUser)


    console.log(socket.handshake.query.token, 'token???')

    if (socket.handshake.query.token != 'undefined') {  //User has token in storage so verify
        jwt.verify(socket.handshake.query.token, 'secretkey', function (err, data) {
            if (err) return socket.emit('error', err)
            socket.emit('user', { user: data.user, socketId: socket.id })
            io.sockets.emit('add', { user: data.user, socketId: socket.id })
        })
    } else { //User doesn't have token so sign up and make new token/user
        console.log('create new user')
        User.create({ name: Math.random() }).then(user => {
            console.log(user, 'new user')
            jwt.sign({ user }, "secretkey", { expiresIn: "7d" }, (err, token) => {
                if (err) return socket.emit('error', err)
                socket.emit('user', { user, token, socketId: socket.id })
                io.sockets.emit('add', { user: data.user, socketId: socket.id })
            })
        })
    }

    socket.on("disconnect", () => {
        console.log("Client disconnected: ", socket.id)
        io.sockets.emit('subtract', { socketId: socket.id })
    });





    // console.log(socket.handshake.query.token)
    // users[socket.id] = 


    // if (socket.handshake.query && socket.handshake.query.token) {
    //     jwt.verify(socket.handshake.query.token, 'secretkey', function (err, data) {
    //         console.log(socket.handshake.query.token)
    //         if (err) return socket.emit('error', { error: err.message })
    //         // Connection now authenticated

    //         console.log(data, ' ??')
    //         socket.emit('user', { user: data.user, token: socket.handshake.query.token })
    //     })
    // }

    // socket.on("disconnect", () => console.log("Client disconnected: ", socket.id));

    // socket.on('signUp', (data) => {
    //     User.register(data, data.password)
    //         .then((user) => {
    //             jwt.sign({ user }, "secretkey", { expiresIn: "7d" }, (err, token) => {
    //                 if (err) return socket.emit('error', { error: err.message })

    //                 // Connection now authenticated
    //                 socket.emit('user', { user, token })
    //             });
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //             socket.emit('error', { error })
    //         });
    // })
    // socket.on('logIn', (user) => {
    //     jwt.sign({ user }, "secretkey", { expiresIn: "7d" }, (err, token) => {
    //         if (err) return socket.emit('error', { error: err.message })

    //         // Connection now authenticated
    //         socket.emit('user', { user, token })
    //     })
    // })
});


server.listen(port, () => console.log(`Listening on port ${port}`));