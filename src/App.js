import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./App.scss";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import { userContext } from "./lib/contexts";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      const emptyUser = { isLogedIn: false };
      try {
        setUser(emptyUser);
      } catch (e) {
        setUser(emptyUser);
      } finally {
        setLoading(false);
      }
    };
    validateUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <Router>
      <userContext.Provider value={user}>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/group-chat">
            <h1>Group Chat</h1>
          </Route>
          <Route path="/login">
            <Login setUser={setUser} />
          </Route>
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
      </userContext.Provider>
    </Router>
  );
}

export default App;
