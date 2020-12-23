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
// import io from "socket.io-client";

// const socket = io(baseURL.replace("/api", ""));

const App = () => {
  let [user, setUser] = useState(null);

  useEffect(() => {
    console.log('turtle')
    async function getUser() {
      let { user } = await actions.getUser();
      console.log(user)
      setUser(user)
    }
    getUser();
  }, []);

  const logOut = async () => {
    let res = await actions.logOut();
    setUser(null);
  };

  const history = useHistory();

  return (
    <TheContext.Provider value={{ history, user, setUser }}>
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
              {/* <NavLink to="/sign-up">Sign Up</NavLink>
              <NavLink to="/log-in">Log In</NavLink> */}
              {!user && <SignUp setUser={setUser} />}
              {!user && <LogIn setUser={setUser} />}
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
