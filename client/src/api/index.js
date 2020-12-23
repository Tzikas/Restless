
import io from "socket.io-client";
const apiURL = "http://127.0.0.1:4001";

console.log('api!@@@@')
// const socket = io(apiURL);


const { token } = localStorage;
console.log(token)
const socket = io('http://localhost:4001', {
    query: { token }
});
console.log('hare')

socket.on('error', (err) => {
    console.log('err', err)
})

export default {
    socket,

    getUser: async () => {
        //socket.emit('getUser')
        return new Promise((resolve, reject) => {
            socket.on('user', user => {
                console.log(user)
                window.localStorage.setItem("token", user?.token)
                resolve(user)
            })
        })
    },

    logOut: async () => {
        socket.emit('logOut')

        window.localStorage.removeItem("token");
        // return await API.get("/logout", resetHead());
    },
    signUp: async (user) => {
        let res = await socket.emit('signUp', user)
        console.log(res)
        window.localStorage.setItem("token", res?.token);
    },
    logIn: async (user) => {
        console.log(user)
        socket.emit('logIn', user)
    },
};

