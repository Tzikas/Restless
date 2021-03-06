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

  useEffect(() => {

    socket.on('user', res => {
      console.log(res)
      sessionStorage.setItem("token", res?.token)
      setUser(res?.user)
    })

    socket.on('error', (err) => console.error(err))

    //Clean up previous connection 
    return () => socket.disconnect();

  }, []);

  const logOut = async () => {
    socket.emit('logOut')
    sessionStorage.removeItem('token')
    setUser(null);
  };

  const history = useHistory();

  return (
    <TheContext.Provider value={{ history, user, setUser, socket }}>
      {user?.email}
      <nav>
        <NavLink to="/home"> Home </NavLink>

        {user ? (
          <Fragment>
            <NavLink onClick={logOut} to="/">
              Log Out
            </NavLink>
            <NavLink to="/profile"> Profile </NavLink>
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
