import React from 'react';
import { Route, Switch } from "react-router-dom";

import Welcome from "./components/Welcome";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/'>
          <Welcome />
        </Route>
        <Route exact path='/profile'>
          <NavBar />
          <Profile />
        </Route>
        <Route exact path='/sign-up'>
          <SignUp />
        </Route>
      </Switch>
    </div>
  );
};

export default App;