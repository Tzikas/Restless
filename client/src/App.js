import React, { Component, Fragment, useState, useEffect } from "react";
import { Switch, Route, NavLink, useHistory } from "react-router-dom";

import TheContext from "./TheContext";
import Home from "./components/home/Home";
import NotFound from "./components/404/NotFound.js";
import SignUp from "./components/auth/SignUp";
import LogIn from "./components/auth/LogIn";
import Profile from "./components/profile/Profile";


import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";


import io from "socket.io-client";

const { token } = sessionStorage;

//Make connection to server just once on page load.
const socket = io('http://localhost:4001', {
  query: { token }
});


const App = () => {

  let [user, setUser] = useState(null);
  let [all, setAll] = useState([])

  useEffect(() => {

    socket.on('new-connection', res => {
      console.log(res)
    })

    socket.on('user', ({ user, token, socketId }) => {
      console.log(user, token, socketId)
      if (token)
        sessionStorage.setItem("token", token)
      user.socketId = socketId
      setUser(user)
    })

    socket.on('add', ({ user, socketId }) => {
      console.log('add ', user?.name, socketId)
    })
    socket.on('subtract', ({ user, socketId }) => {
      console.log('subtract ', user?.name, socketId)

    })


    socket.on('error', (err) => console.error(err))

    //Clean up previous connection 
    return () => {
      socket.off('new-connection')
      socket.off('user')
      socket.off('add')
      socket.off('subtract')
      socket.off('error')
      socket.disconnect();
    }

  }, []);



  const history = useHistory();

  return (
    <TheContext.Provider value={{ history, user, setUser, socket }}>
      <h3>{user?.name} {user?.socketId}</h3>
      <nav>
        {/* <NavLink to='/'>Home</NavLink>
        <NavLink to='/profile/${sdf}'>Profile</NavLink> */}
        <button onClick={() => history.push(`/`)}>Home</button>
        <button onClick={() => history.push(`/profile/${user._id}`)}>Profile</button>

        <h2>meow. im huuungry. meow.</h2>
      </nav>
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => <Home {...props} user={user} />}
        />


        <Route
          exact
          path="/profile/:id"
          render={(props) => <Profile {...props} />}
        />

        <Route component={NotFound} />
      </Switch>

      <NotificationContainer />
    </TheContext.Provider>
  );
};
export default App;
