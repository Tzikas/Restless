import React, { Component, Fragment, useState, useEffect } from "react";
import { Switch, Route, NavLink, useHistory } from "react-router-dom";

import TheContext from "./TheContext";
import Home from "./components/home/Home";
import NotFound from "./components/404/NotFound.js";
import SignUp from "./components/auth/SignUp";
import LogIn from "./components/auth/LogIn";
import Profile from "./components/profile/Profile";
import actions from "./api/index";


import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";


import io from "socket.io-client";

// const socket = io(apiURL);



const App = () => {

  const { token } = localStorage;
  const socket = io('http://localhost:4001', {
    query: { token }
  });


  let [user, setUser] = useState(null);

  useEffect(() => {

    socket.on('user', res => {
      console.log(res)
      localStorage.setItem("token", res?.token)
      setUser(res?.user)
    })

    socket.on('error', (err) => {
      console.log('err', err)
    })

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
    //
  }, []);

  const logOut = async () => {
    socket.emit('logOut')
    localStorage.removeItem('token')
    setUser(null);
  };

  const history = useHistory();

  return (
    <TheContext.Provider value={{ history, user, setUser, socket }}>
      {user?.email}
      <nav>
        <NavLink to="/home">Home</NavLink>

        {user ? (
          <Fragment>
            <NavLink onClick={logOut} to="/">
              Log Out
            </NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </Fragment>
        ) : (
            <Fragment>
              {!user && <SignUp setUser={setUser} socket={socket} />}
              {!user && <LogIn setUser={setUser} socket={socket} />}
            </Fragment>
          )}
      </nav>
      <Switch>
        <Route
          exact
          path="/home"
          render={(props) => <Home {...props} user={user} />}
        />


        <Route
          exact
          path="/profile"
          render={(props) => <Profile {...props} />}
        />

        <Route component={NotFound} />
      </Switch>

      <NotificationContainer />
    </TheContext.Provider>
  );
};
export default App;
